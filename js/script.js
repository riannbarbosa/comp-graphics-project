// Criação da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const floorTexture = new THREE.TextureLoader().load('./img/wood-texture.jpg', function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
}, undefined, function (err) {
    console.error('Erro ao carregar a textura do chão:', err);
});

const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const wallTexture = new THREE.TextureLoader().load('./img/wall-texture.png', function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2);
}, undefined, function (err) {
    console.error('Erro ao carregar a textura da parede:', err);
});

const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });
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

const ceilingTexture = new THREE.TextureLoader().load('./img/forro.png', function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
}, undefined, function (err) {
    console.error('Erro ao carregar a textura do teto:', err);
});

const ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture, side: THREE.DoubleSide });
const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
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
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(position.x, position.y, -9.95);

        galleryGroup.add(frame);
        galleryGroup.add(painting);
    }, undefined, function (err) {
        console.error('Erro ao carregar a textura da pintura:', err);
    });
}

function createSign(text) {
    const group = new THREE.Group();

    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
    const poleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0, 1, 0);
    group.add(pole);

    const signGeometry = new THREE.PlaneGeometry(2.5, 1.25);
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 180;
    const context = canvas.getContext('2d');

    const borderSize = 10;

    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#FFFFFF';
    context.fillRect(borderSize, borderSize, canvas.width - 2 * borderSize, canvas.height - 2 * borderSize);

    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = 30;
    
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], canvas.width / 2, (canvas.height / 2) + (i - lines.length / 2) * lineHeight);
    }

    const signTexture = new THREE.CanvasTexture(canvas);
    const signMaterial = new THREE.MeshBasicMaterial({ map: signTexture, side: THREE.DoubleSide });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 1.75, 0.1);
    
    sign.rotation.y = Math.PI / 8;

    group.add(sign);

    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0, 0);
    group.add(base);

    return group;
}

function createArtSign(title, author, style) {
    const text = `Nome da Obra: ${title}\nAutor: ${author}\nEstilo: ${style}`;
    return createSign(text);
}

const sign1 = createArtSign('Mona Lisa', 'Leonardo Da Vinci', 'Renascentista');
sign1.position.set(-8.3, 0, -9.5);
scene.add(sign1);

const sign2 = createArtSign('O Grito', 'Edvard Munch', 'Expressionismo');
sign2.position.set(-2.3, 0, -9.5);
scene.add(sign2);

const sign3 = createArtSign('Abaporu', 'Tarsila do Amaral', 'Modernismo');
sign3.position.set(3.7, 0, -9.5);
scene.add(sign3);

const paintingTextures = [
    './img/monalisa.png',
    './img/grito.png',
    './img/abaporu.png',
    './img/monalisa.png'
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

    newX = Math.max(limits.minX, Math.min(limits.maxX, newX));
    newZ = Math.max(limits.minZ, Math.min(limits.maxZ, newZ));

    camera.position.x = newX;
    camera.position.z = newZ;
    
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

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
