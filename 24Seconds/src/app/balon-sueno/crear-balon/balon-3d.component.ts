// Componente para mostrar el balón 3D girando y cambiar su color
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// @ts-ignore
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../cart.service';
import { NotificacionService } from '../../notificacion.service';

@Component({
  selector: 'app-balon-3d',
  standalone: true,
  templateUrl: './balon-3d.component.html',
  styleUrls: ['./balon-3d.component.css'],
  imports: [FormsModule]
})
export class Balon3dComponent implements OnInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  color: string = '#ff8000';
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId: any;
  private balonMesh: THREE.Mesh | null = null;
  private cartService = inject(CartService);
  private notiSrv = inject(NotificacionService);

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.initThree();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
  }

  initThree() {
    const width = 400;
    const height = 400;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 2.2);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);

    // Aura effect
    const aura = new THREE.PointLight(0xffd700, 1.2, 10);
    aura.position.set(0, 0, 2);
    this.scene.add(aura);

    // Ambient light
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    // Cargar texturas PBR
    const textureLoader = new THREE.TextureLoader();
    const baseColor = textureLoader.load('assets/models/ball_ball_BaseColor.png');
    const normalMap = textureLoader.load('assets/models/ball_ball_Normal.png');
    const roughnessMap = textureLoader.load('assets/models/ball_ball_Roughness.png');
    const metalnessMap = textureLoader.load('assets/models/ball_ball_Metallic.png');

    // Load MTL and OBJ
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('assets/models/');
    mtlLoader.load('uploads_files_2222080_ball_obj.mtl', (materials: any) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('assets/models/');
      objLoader.load('basketball.obj', (object: any) => {
        object.traverse((child: any) => {
          if (child.isMesh) {
            // Material PBR con color base editable
            child.material = new THREE.MeshStandardMaterial({
              map: baseColor,
              normalMap: normalMap,
              roughnessMap: roughnessMap,
              metalnessMap: metalnessMap,
              color: this.color,
              roughness: 1,
              metalness: 0.5
            });
            this.balonMesh = child;
          }
        });
        object.scale.set( 3.5, 3.5, 3.5); // Aumenta el tamaño del balón
        this.scene.add(object);
      });
    });

    this.animate();
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    if (this.balonMesh) {
      this.balonMesh.rotation.y += 0.01;
    }
    this.renderer.render(this.scene, this.camera);
  };

  onColorChange(event: any) {
    this.color = event.target.value;
    if (this.balonMesh) {
      const mat = this.balonMesh.material as THREE.MeshStandardMaterial;
      mat.color.set(this.color);
    }
  }

  async onAddToCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.notiSrv.mostrar({ mensaje: 'Debes iniciar sesión para añadir productos al carrito', tipo: 'warning' });
      return;
    }
    try {
      // 1. Crear producto personalizado
      const res = await fetch('http://localhost:4001/api/products/custom-ball', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ color: this.color })
      });
      if (!res.ok) throw new Error('No se pudo crear el balón personalizado');
      const producto = await res.json();
      // 2. Añadir al carrito
      await this.cartService.addToCart(producto._id, 1, token);
      this.cartService.notifyCartUpdated();
      this.notiSrv.mostrar({ mensaje: 'Balón personalizado añadido al carrito', tipo: 'success' });
    } catch (e) {
      this.notiSrv.mostrar({ mensaje: 'Error al añadir al carrito', tipo: 'error' });
    }
  }

  irACoomingSoon() {
    window.location.href = '/coomingsoon';
  }
}
