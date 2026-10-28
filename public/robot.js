/* Робот-андроид в первом экране.

   Отдельный скрипт, а не React-компонент: сцена живёт своей жизнью и не
   зависит от перерисовок страницы. В React-варианте эффект пересоздавался
   при каждом изменении размера холста (а цикл кадров сам его меняет), и
   загрузка модели обрывалась на середине — робот не появлялся вовсе.

   Скрипт сам находит место для себя (элемент #robot-slot), грузит three и
   модель по требованию и останавливает отрисовку, когда экран ушёл.

   Модель сжата (EXT_meshopt_compression), поэтому подключается декодер —
   без него загрузчик молча не собирает меш.
*/
(function () {
  'use strict';
  // Одноразовый запуск не годится: страницу перерисовывает React, место под
  // робота вместе с холстом пересоздаётся, а скрипт считал себя отработавшим
  // и сцену больше не строил.
  if (window.__smitRobotWatching) return;
  window.__smitRobotWatching = true;

  var MIN_WIDTH = 1024;          // ниже — не показываем: перекроет текст
  var MODEL = '/models/robot.glb';
  // Пути разрешает карта импортов в index.html — иначе GLTFLoader не найдёт
  // свой собственный import from 'three'.
  var THREE_URL = 'three';
  var GLTF_URL = 'three/examples/jsm/loaders/GLTFLoader.js';
  var MESHOPT_URL = 'three/examples/jsm/libs/meshopt_decoder.module.js';

  function can() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (window.innerWidth < MIN_WIDTH) return false;
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }

  function findSlot() {
    return document.getElementById('robot-slot');
  }

  var started = false;
  var building = false;

  function start() {
    var slot = findSlot();
    // Холст мог пропасть вместе с перерисованной разметкой — тогда строим
    // заново. Но пока сцена строится (библиотеки ещё грузятся), холста тоже
    // нет — поэтому держим отдельный признак «уже строим», иначе за секунду
    // создаётся пяток сцен разом.
    if (building) return;
    if (started && slot && slot.querySelector('canvas')) return;
    if (!slot || !can()) return;
    building = true;
    started = true;

    // Библиотеки берём с CDN: сборщик раскладывал их по чанкам, а нам нужен
    // предсказуемый импорт из обычного скрипта.
    Promise.all([
      import(THREE_URL),
      import(GLTF_URL),
      import(MESHOPT_URL).catch(function () { return null; }),
    ]).then(function (mods) {
      building = false;
      var THREE = mods[0];
      var GLTFLoader = mods[1].GLTFLoader;
      var meshopt = mods[2];

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

      var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
      slot.appendChild(renderer.domElement);

      // Свет: мягкий общий плюс белый спереди и фирменный зелёный сзади —
      // силуэт отделяется от тёмного фона.
      scene.add(new THREE.AmbientLight(0xffffff, 2.2));
      var key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(2, 3, 4);
      scene.add(key);
      var rim = new THREE.DirectionalLight(0x34d399, 2.4);
      rim.position.set(-3, 1.5, -2);
      scene.add(rim);

      var group = new THREE.Group();
      scene.add(group);

      var mixer = null;
      var clock = new THREE.Clock();

      var lastW = 0;
      var lastH = 0;
      function resize() {
        var r = slot.getBoundingClientRect();
        var w = Math.max(1, Math.round(r.width));
        var h = Math.max(1, Math.round(r.height));
        if (w === lastW && h === lastH) return;
        lastW = w;
        lastH = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();

      var loader = new GLTFLoader();
      if (meshopt && meshopt.MeshoptDecoder) {
        loader.setMeshoptDecoder(meshopt.MeshoptDecoder);
      }

      loader.load(MODEL, function (gltf) {
        var model = gltf.scene;
        model.updateMatrixWorld(true);

        // Вписываем модель в кадр: приводим к единице и ставим камеру по её
        // реальным габаритам, а не по подобранному на глаз расстоянию.
        var box = new THREE.Box3().setFromObject(model);
        var size = box.getSize(new THREE.Vector3());
        var center = box.getCenter(new THREE.Vector3());
        var maxSide = Math.max(size.x, size.y, size.z) || 1;

        model.position.sub(center);
        model.scale.setScalar(1 / maxSide);
        model.position.multiplyScalar(1 / maxSide);
        group.add(model);

        var fitH = size.y / maxSide;
        var fov = (camera.fov * Math.PI) / 180;
        camera.position.set(0, 0, (fitH / 2) / Math.tan(fov / 2) * 1.3);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          // Спокойное ожидание: танец и приветствие в петле отвлекали бы.
          var clip = null;
          for (var i = 0; i < gltf.animations.length; i++) {
            if (gltf.animations[i].name === 'wait') { clip = gltf.animations[i]; break; }
          }
          mixer.clipAction(clip || gltf.animations[0]).play();
        }
      }, undefined, function (err) {
        // Модель не загрузилась — место останется пустым; сообщение в консоли,
        // иначе сбой выглядит как «робота просто нет».
        console.warn('[robot] модель не загрузилась:', err);
      });

      // Доворот за курсором: небольшой, чтобы не отвлекал от текста.
      var mx = 0;
      var my = 0;
      window.addEventListener('pointermove', function (e) {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      var raf = 0;
      var running = true;

      function frame() {
        if (!running) return;
        var d = clock.getDelta();
        if (mixer) mixer.update(d);
        group.rotation.y += ((mx * 0.5) - group.rotation.y) * 0.04;
        group.rotation.x += ((my * 0.14) - group.rotation.x) * 0.04;
        resize();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      }
      frame();

      // За экраном не считаем: WebGL дороже обычного холста.
      try {
        new IntersectionObserver(function (es) {
          if (es[0].isIntersecting) {
            if (!running) { running = true; clock.getDelta(); frame(); }
          } else {
            running = false;
            if (raf) cancelAnimationFrame(raf);
          }
        }, { threshold: 0 }).observe(slot);
      } catch (e) { /* старый браузер — пусть считает всегда */ }

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          running = false;
          if (raf) cancelAnimationFrame(raf);
        } else if (!running) {
          running = true;
          clock.getDelta();
          frame();
        }
      });
    }).catch(function (e) {
      building = false;
      started = false;
      console.warn('[robot] библиотеки не загрузились:', e);
    });
  }

  // Место под робота появляется вместе с первым экраном — ждём его.
  // Проверяем и при изменении размера окна: при первой попытке окно бывает
  // ещё узким (мобильная вёрстка, поворот экрана), и робот пропускался
  // навсегда, хотя места для него уже хватало.
  function watch() {
    var tries = 0;

    function attempt() {
      var slot = findSlot();
      if (!slot || !can()) return;
      // строим сцену, если её ещё нет или холст потерялся при перерисовке
      if (!slot.querySelector('canvas')) start();
    }

    attempt();

    // Следим постоянно: разметка появляется позже скрипта, а при переходах
    // внутри страницы её пересоздают — холст тогда надо вернуть.
    var mo = new MutationObserver(attempt);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('resize', attempt);

    // первые секунды проверяем чаще: вёрстка и размеры доезжают не сразу
    var timer = setInterval(function () {
      tries += 1;
      attempt();
      if (tries > 30) clearInterval(timer);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch, { once: true });
  } else {
    watch();
  }
})();
