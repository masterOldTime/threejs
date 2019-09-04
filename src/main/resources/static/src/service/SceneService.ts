import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";

/**
 * 自定义Scene类，对场景进行初始化封装
 */
export class SceneService {
    public scene?: THREE.Scene;
    public camera?: THREE.PerspectiveCamera;
    public controls?: OrbitControls;
    private renderer?: THREE.WebGLRenderer;
    private cSS2DRenderer?: CSS2DRenderer;
    private cSS3DRenderer?: CSS3DRenderer;

    /**
     * 初始化场景
     */
    public initScene(): void {

        //创建场景
        this.scene = new THREE.Scene();

        //世界坐标象限（辅助工具）
        // this.scene.add(new THREE.AxesHelper(1000));

        //镜头
        this.perspectiveCamera();

        //渲染器
        this.webGLRenderer();
        this.cSS2DRendererFun();
        this.cSS3DRendererFun();

        //控制器
        this.orbitControls();

        //灯光
        this.light();

        //背景
        this.background();

        //最后一步：不停的循环渲染
        this.render();
    }

    /**
     * 背景
     */
    private background(): void {
        /* 天空盒子图片 */
        // let path = "/images/skybox/";       //设置路径
        // let format = '.jpg';        //设定格式
        // let urls = [
        //     path + 'px' + format, path + 'nx' + format,
        //     path + 'py' + format, path + 'ny' + format,
        //     path + 'pz' + format, path + 'nz' + format
        // ];
        // this.scene.background = new THREE.CubeTextureLoader().load(urls);

        //地球星空背景
        // this.scene.background = new THREE.TextureLoader().load('/images/earth/bg.jpg');

        //雾
        // this.scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);
    }

    /**
     * 控制器
     */
    private orbitControls(): void {
        //场景控制器，为了能控制到CSS3D的dom，我们添加的是this.cSS3DRenderer.domElement
        this.controls = new OrbitControls(this.camera, this.cSS3DRenderer.domElement);
        //监听
        window.addEventListener('resize', this.onWindowResize, false);

        this.controls.target = new THREE.Vector3(0, 0, 0);
        // this.controls.enableDamping = true;//启用阻尼（惯性）
        // this.controls.dampingFactor = 1.0;//阻尼惯性有多大
    }

    /**
     * 渲染器
     */
    private webGLRenderer(): void {
        //创建一个渲染器
        this.renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //是否渲染阴影
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    }

    private cSS2DRendererFun(): void {
        this.cSS2DRenderer = new CSS2DRenderer();
        this.cSS2DRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cSS2DRenderer.domElement.style.position = 'absolute';
        this.cSS2DRenderer.domElement.style.top = "0";
        document.body.appendChild(this.cSS2DRenderer.domElement);
    }

    private cSS3DRendererFun(): void {
        this.cSS3DRenderer = new CSS3DRenderer();
        this.cSS3DRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cSS3DRenderer.domElement.style.position = 'absolute';
        this.cSS3DRenderer.domElement.style.top = "0";
        document.body.appendChild(this.cSS3DRenderer.domElement);
    }

    /**
     * 镜头
     */
    private perspectiveCamera(): void {
        //创建一个透视相机，默认看向的坐标是0,0,0
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);

        //镜头的位置
        this.camera.position.set(0, 0, 0);

        //镜头看的坐标
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        //镜头辅助工具
        // this.scene.add(new THREE.CameraHelper(camera));
    }

    /**
     * 灯光
     */
    private light(): void {
        //环境光
        this.scene.add(new THREE.AmbientLight(0xdfebff, 0.3));

        //点光源
        // let pointLight = new THREE.PointLight(0xffffff, 1, 0,1);
        // pointLight.position.set(0, 500, 0);
        // pointLight.castShadow = true;
        // this.scene.add(pointLight);
        // this.scene.add(new THREE.CameraHelper(pointLight.shadow.camera));

        //基础的平行光
        let directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, 5000, 5000);
        directionalLight.castShadow = true;
        directionalLight.name = "basisDirectionalLight";
        this.scene.add(directionalLight);
        this.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
    }

    /**
     * 不停的渲染，在这里不停的渲染就行了，其他地方都不需要再进行渲染
     */
    private render(): any {
        //渲染
        this.renderer.render(this.scene, this.camera);
        this.cSS2DRenderer.render(this.scene, this.camera);
        this.cSS3DRenderer.render(this.scene, this.camera);

        //控制器
        this.controls.update();

        //动画循环
        let thid = this;
        /*
            requestAnimationFrame：与setTimeout相比，requestAnimationFrame最大的优势是由系统来决定回调函数的执行时机。
            具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，那么这个时间间隔就变成了1000/75=13.3ms，
            换句话说就是，requestAnimationFrame的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，
            这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。
         */
        requestAnimationFrame(function () {
            thid.render()
        });
    }

    /**
     * 缩放窗口
     */
    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.cSS2DRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cSS3DRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * 封装原生监听对象事件
     */
    public addEventListener(listenerObj?: THREE.Object3D, even?: string, callback ?: (object: THREE.Object3D) => void): void {
        let thid = this;

        //threejs原生事件监听 mousedown
        this.cSS3DRenderer.domElement.addEventListener(even, function (event) {
            //阻止冒泡
            event.preventDefault();

            //光线投射
            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();

            mouse.x = (event["clientX"] / thid.cSS3DRenderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event["clientY"] / thid.cSS3DRenderer.domElement.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, thid.camera);
            // 需要被监听的对象要存储在intersectObjects中,对象本身就是一个group，所以不能直接检测射线（三维世界中点击事件需要检测射线），
            // 其下children里面有许多mesh，才是要被检测的目标。
            let intersects;
            if (listenerObj.type == "Mesh") {
                intersects = raycaster.intersectObjects([listenerObj], false);
            } else {
                intersects = raycaster.intersectObjects(listenerObj.children, true);
            }
            if (intersects.length > 0) {
                // 回调函数，返回被监听对象本身
                if (callback) callback(listenerObj);
            }
        }, false);
    }

    /**
     * 封装镜头动画效果，onUpdate回调中是0-1的递增值，具体操作在onUpdate中进行
     */
    public myAnimate(level?: number, onUpdate ?: (value ?: number) => void, callback ?: () => void): void {
        let value = 0;//在一定时间段内，从0到1
        let _value = 0.01 * level;
        animate(value);

        function animate(value ?: number) {
            //动画进行时调用
            if (onUpdate) onUpdate(value);

            //动画循环
            requestAnimationFrame(function () {
                //只保留两个小数
                value += _value;
                value = Number(value.toFixed(2));
                //动画结束
                if (value > 1) {
                    if (callback) callback();
                    return;
                }
                animate(value);
            });
        }
    }

    /**
     * 镜头巡检、视察，从当前镜头移动到指定position，三个向量值每次增加value
     */
    public cameraInspect(value?: number, position?: {}, callback ?: () => void): void {
        let thid = this;
        let flag = value >= 0;

        cameraInspectAnimate();

        function cameraInspectAnimate() {
            if(flag){
                if (thid.camera.position.x < position["x"]){
                    thid.camera.position.x += value;
                }
                if (thid.camera.position.y < position["y"]) {
                    thid.camera.position.y += value;
                }
                if (thid.camera.position.z < position["z"]) {
                    thid.camera.position.z += value;
                }
            }else{
                if (thid.camera.position.x > position["x"]) {
                    thid.camera.position.x += value;
                }
                if (thid.camera.position.y > position["y"]) {
                    thid.camera.position.y += value;
                }
                if (thid.camera.position.z > position["z"]) {
                    thid.camera.position.z += value;
                }
            }

            requestAnimationFrame(function () {
                if(flag){
                    if (thid.camera.position.x >= position["x"] &&
                        thid.camera.position.y >= position["y"] &&
                        thid.camera.position.z >= position["z"]) {
                        if (callback) callback();
                        return;
                    }
                }else{
                    if (thid.camera.position.x <= position["x"] &&
                        thid.camera.position.y <= position["y"] &&
                        thid.camera.position.z <= position["z"]) {
                        if (callback) callback();
                        return;
                    }
                }

                cameraInspectAnimate();
            });
        }
    }
}