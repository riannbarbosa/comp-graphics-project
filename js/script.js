const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xF5F5DC });
const wallGeometry = new THREE.PlaneGeometry(20, 10);

const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
frontWall.position.z = -10;
scene.add(frontWall);

const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.z = 10;
backWall.rotation.y = Math.PI;
scene.add(backWall);

const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.x = -10;
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.x = 10;
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 5;
scene.add(ceiling);

const galleryGroup = new THREE.Group();
scene.add(galleryGroup);

const paintingPositions = [
    { x: -6, y: 2.5 },
    { x: 0, y: 2.5 },
    { x: 6, y: 2.5 }
];

function createPainting(position, texturePath) {
    const paintingTexture = new THREE.TextureLoader().load(texturePath, function (texture) {
        const paintingGeometry = new THREE.PlaneGeometry(2, 4);
        const paintingMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
        painting.position.set(position.x, position.y, -9.85);

        const frameGeometry = new THREE.BoxGeometry(2.2, 4.2, 0.01);
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(position.x, position.y, -9.95);

        galleryGroup.add(frame);
        galleryGroup.add(painting);
    }, undefined, function (err) {
        console.error('Erro ao carregar a textura da pintura:', err);
    });
}

const paintingTextures = [
    './img/first-animal.png',
    './img/second-animal.png',
    './img/third-animal.png'
];

paintingPositions.forEach((pos, index) => {
    createPainting(pos, paintingTextures[index]);
});

camera.position.set(0, 1.6, 5);

const moveSpeed = 0.05;
const lookSpeed = 0.01;

let moveForward = false;    
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let yaw = 0;
let pitch = 0;

const limits = {
    minX: -9,
    maxX: 9,
    minY: 0,
    maxY: 5,
    minZ: -9,
    maxZ: 9
};

window.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'w':
            moveBackward = true;
            break;
        case 's':
            moveForward = true;
            break;
        case 'a':
            moveLeft = true;
            break;
        case 'd':
            moveRight = true;
            break;
    }
});

window.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'w':
            moveBackward = false;
            break;
        case 's':
            moveForward = false;
            break;
        case 'a':
            moveLeft = false;
            break;
        case 'd':
            moveRight = false;
            break;
    }
});

window.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    yaw -= (mouseX * lookSpeed);
    pitch -= (mouseY * lookSpeed);
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
});

function animate() {
    requestAnimationFrame(animate);

    let newX = camera.position.x;
    let newZ = camera.position.z;

    if (moveForward) {
        newX += Math.sin(yaw) * moveSpeed;
        newZ += Math.cos(yaw) * moveSpeed;
    }
    if (moveBackward) {
        newX -= Math.sin(yaw) * moveSpeed;
        newZ -= Math.cos(yaw) * moveSpeed;
    }
    if (moveLeft) {
        newX -= Math.cos(yaw) * moveSpeed;
        newZ += Math.sin(yaw) * moveSpeed;
    }
    if (moveRight) {
        newX += Math.cos(yaw) * moveSpeed;
        newZ -= Math.sin(yaw) * moveSpeed;
    }

    if (newX < limits.minX) {
        newX = limits.minX;
    } else if (newX > limits.maxX) {
        newX = limits.maxX;
    }

    if (newZ < limits.minZ) {
        newZ = limits.minZ;
    } else if (newZ > limits.maxZ) {
        newZ = limits.maxZ;
    }

    if (camera.position.y < limits.minY) {
        camera.position.y = limits.minY;
    } else if (camera.position.y > limits.maxY) {
        camera.position.y = limits.maxY;
    }

    camera.position.x = newX;
    camera.position.z = newZ;

    camera.rotation.x = pitch;
    camera.rotation.y = yaw;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

animate();
