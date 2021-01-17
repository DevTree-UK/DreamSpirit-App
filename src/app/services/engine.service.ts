import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import { Vector3 } from 'three';

@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;

  private width: number;
  private height: number;

  private grid_nodes: [];
  private outline: THREE.Line;
  private rotationIndex: 0;

  private flipflop: boolean;

  private frameId: number = null;

  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>, width: number, height: number): void {
    this.canvas = canvas.nativeElement;
    this.width = width;
    this.height = height;
    this.flipflop = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.width, this.height);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45, this.width / this.height, 1, 500
    );
    this.camera.position.set( 0, 0, 10 );
    this.camera.lookAt( 0, 0, 0 );

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0.8, -0.3, 0));
    points.push(new THREE.Vector3(1.6, -1, 0));
    points.push(new THREE.Vector3(2, -2, 0));
    points.push(new THREE.Vector3(1.6, -3, 0));
    points.push(new THREE.Vector3(0.8, -3.7, 0));
    points.push(new THREE.Vector3(0, -4, 0));
    points.push(new THREE.Vector3(-0.8, -3.7, 0));
    points.push(new THREE.Vector3(-1.6, -3, 0));
    points.push(new THREE.Vector3(-2, -2, 0));
    points.push(new THREE.Vector3(-1.6, -1, 0));
    points.push(new THREE.Vector3(-0.8, -0.3, 0));
    points.push(new THREE.Vector3(0, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    this.outline = new THREE.Line( geometry, material );
    this.scene.add( this.outline );
  }

  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.outline.rotateZ(30);

    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }
}
