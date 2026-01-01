// Minimal Three.js animated 3D background with neon lighting
(function(){
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 1000);
  camera.position.set(0,0,6);

  // geometry + material (shiny, emissive)
  const geo = new THREE.TorusKnotGeometry(1.25,0.35,256,40);
  const mat = new THREE.MeshStandardMaterial({
    color:0x0b0b0b,
    metalness:0.9,
    roughness:0.15,
    emissive:0x220000,
    emissiveIntensity:0.8
  });
  const knot = new THREE.Mesh(geo, mat);
  scene.add(knot);

  // secondary translucent shell for glow
  const shellMat = new THREE.MeshBasicMaterial({color:0xff1f2f, transparent:true, opacity:0.06});
  const shell = new THREE.Mesh(new THREE.TorusKnotGeometry(1.4,0.45,256,40), shellMat);
  scene.add(shell);

  // lights - red & blue neon
  const rLight = new THREE.PointLight(0xff1f2f, 1.4, 12);
  rLight.position.set(4,2,2);
  scene.add(rLight);

  const bLight = new THREE.PointLight(0x4dd2ff, 1.2, 12);
  bLight.position.set(-4,-2,2);
  scene.add(bLight);

  const amb = new THREE.AmbientLight(0xffffff, 0.06);
  scene.add(amb);

  function resize(){
    const w = innerWidth; const h = innerHeight;
    renderer.setSize(w,h);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize, {passive:true});
  resize();

  // subtle camera motion on mouse
  let mx=0,my=0;
  addEventListener('mousemove', (e)=>{
    mx = (e.clientX / innerWidth - 0.5) * 1.4;
    my = (e.clientY / innerHeight - 0.5) * -1.4;
  });

  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    knot.rotation.x = 0.25 * Math.sin(t*0.6) + t*0.08;
    knot.rotation.y = -0.1 * Math.cos(t*0.9) + t*0.06;
    shell.rotation.x = knot.rotation.x * 0.92;
    shell.rotation.y = knot.rotation.y * 0.98;

    // move camera slightly
    camera.position.x += (mx - camera.position.x) * 0.06;
    camera.position.y += (my - camera.position.y) * 0.06;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // reduce motion on mobile
  if(/Mobi|Android/i.test(navigator.userAgent)){
    knot.rotation.x = 0.2; knot.rotation.y = 0.3;
  }
})();
