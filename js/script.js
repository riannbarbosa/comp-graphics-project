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
    { x: -6, y: 2.5, z: -9.85 },
    { x: 0, y: 2.5, z: -9.85 },
    { x: 6, y: 2.5, z: -9.85 },

    { x: -6, y: 2.5, z: 9.80 },
    { x: 0, y: 2.5, z: 9.80 },
    { x: 6, y: 2.5, z: 9.80 },

    { x: -9.85, y: 2.5, z: -6 },
    { x: -9.85, y: 2.5, z: 0 },
    { x: -9.85, y: 2.5, z: 6 },

    { x: 9.85, y: 2.5, z: -6 },
    { x: 9.85, y: 2.5, z: 0 },
    { x: 9.85, y: 2.5, z: 6 }
];

const paintingTextures = [
    './img/monalisa.png',
    './img/hand.jpg',
    './img/american-gothic-1930.jpeg',

    './img/grito.png',
    './img/three_vangogh.jpg',
    './img/hyacinthe.jpeg',

    './img/abaporu.png',
    './img/jonathan-buttall.jpg',
    './img/the-arnolfini.jpg',

    './img/Pearl_Earring.jpg',
    './img/ytho.jpg',
    './img/The_Madonna.jpg'
];

function createPainting(position, texturePath, rotationY, prof, auxX) {
    const paintingTexture = new THREE.TextureLoader().load(texturePath, function (texture) {
        const paintingGeometry = new THREE.PlaneGeometry(2, 4);
        const paintingMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);

        painting.position.set(position.x, position.y, position.z);

        painting.rotation.y = rotationY;

        const frameGeometry = new THREE.BoxGeometry(2.2, 4.2, 0.01);
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        
        frame.position.set(auxX, position.y, position.z - prof);
        frame.rotation.y = rotationY;
        
        galleryGroup.add(frame);
        galleryGroup.add(painting);
    }, undefined, function (err) {
        console.error('Erro ao carregar a textura da pintura:', err);
    });
}

const paintingRotations = [
    0,   
    0,
    0,    

    Math.PI,
    Math.PI,
    Math.PI,

    Math.PI / 2,
    Math.PI / 2,
    Math.PI / 2,

    -Math.PI / 2,
    -Math.PI / 2,  
    -Math.PI / 2
];

paintingPositions.forEach((pos, index) => {
    if(paintingRotations[index] == 0) {
        createPainting(pos, paintingTextures[index], paintingRotations[index], 0.01, pos.x);
    } else if(paintingRotations[index] == Math.PI) {
        createPainting(pos, paintingTextures[index], paintingRotations[index], -0.05, pos.x);
    }else if(paintingRotations[index] === Math.PI / 2) {
        createPainting(pos, paintingTextures[index], paintingRotations[index], 0.01, -9.88);
    }else if(paintingRotations[index] === -Math.PI / 2) {
        createPainting(pos, paintingTextures[index], paintingRotations[index], 0.01, 9.88);
    }
});


function createSign(text, position) {
    const group = new THREE.Group();

    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
    const poleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(position.x, position.y, position.z);
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
    sign.position.set(position.x, position.y + 1.75, position.z + 0.1);

    sign.rotation.y = Math.PI / 8;

    group.add(sign);

    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(position.x, position.y, position.z);
    group.add(base);

    return group;
}

function createArtSign(title, author, style, position) {
    const text = `Nome da Obra: ${title}\nAutor: ${author}\nEstilo: ${style}`;
    return createSign(text, position);
}

const artDetailsFront = [
    { title: 'Mona Lisa', author: 'Leonardo Da Vinci', style: 'Renascentista' },
    { title: 'The Village Politicians', author: 'John L. Krimmel', style: 'Renascentista' },
    { title: 'American Gothic (1930)', author: 'Grant Wood', style: 'Regionalismo' }
];

const artDetailsBack = [
    { title: 'O Grito', author: 'Edvard Munch', style: 'Expressionismo' },
    { title: 'Almond Blossom ', author: 'Vincent Van Gogh', style: 'Pós-impressionismo' },
    { title: 'Portrait of Louis XIV (1701)', author: 'Hyacinthe Rigaud', style: 'Barroco' }
];

const artDetailsLeft = [
    { title: 'Abaporu', author: 'Tarsila do Amaral', style: 'Modernismo' },
    { title: 'The Blue Boy (1770)', author: 'Thomas Gainsborough', style: 'Rococo' },
    { title: 'The Arnolfini Portrait (1434)', author: 'Jan van Eyck', style: 'Early Netherlandish' }
];

const artDetailsRight = [
    { title: 'The Girl with a Pearl Earring (1665)', author: 'Johannes Vermeer', style: 'Tronie' },
    { title: 'Pope Leo X (after Raphael) - 1964', author: 'Fernando Botero', style: '-' },
    { title: 'The Madonna Litta by Leonardo da Vinci (1491) ', author: 'Leonardo Da Vinci', style: 'Renascentista' }
];


artDetailsFront.forEach((art, index) => {
    const signPosition = { x: -8.3 + (index * 6), y: 0, z: -9.5 };
    const artSign = createArtSign(art.title, art.author, art.style, signPosition);
    scene.add(artSign);
});

artDetailsBack.forEach((art, index) => {
    const signPosition = { x: -8.3 + (index * 6), y: 0, z: 9.5 };
    const artSign = createArtSign(art.title, art.author, art.style, signPosition);
    scene.add(artSign);
});

artDetailsLeft.forEach((art, index) => {
    const signPosition = { x: -9.5, y: 0, z: -6 + (index * 6) };
    const artSign = createArtSign(art.title, art.author, art.style, signPosition);
    scene.add(artSign);
});

artDetailsRight.forEach((art, index) => {
    const signPosition = { x: 9, y: 0, z: -6 + (index * 6) };
    const artSign = createArtSign(art.title, art.author, art.style, signPosition);
    scene.add(artSign);
});

paintingPositions.forEach((pos, index) => {
    createPainting(pos, paintingTextures[index]);
});

camera.position.set(0, 1.6, 5);

const moveSpeed = 0.3;
const lookSpeed = 0.00002;

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

function requestPointerLock() {
    document.body.requestPointerLock = document.body.requestPointerLock ||
                                      document.body.mozRequestPointerLock ||
                                      document.body.webkitRequestPointerLock;

    document.body.requestPointerLock();
}

document.addEventListener('pointerlockchange', function() {
    if (document.pointerLockElement === document.body) {
        console.log('Pointer locked');
    } else {
        console.log('Pointer unlocked');
    }
});

window.addEventListener('click', requestPointerLock);

window.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'w':
            moveForward = true;
            break;
        case 's':
            moveBackward = true;
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
            moveForward = false;
            break;
        case 's':
            moveBackward = false;
            break;
        case 'a':
            moveLeft = false;
            break;
        case 'd':
            moveRight = false;
            break;
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (moveForward) {
        camera.position.z -= moveSpeed * Math.cos(yaw);
        camera.position.x -= moveSpeed * Math.sin(yaw);
    }
    if (moveBackward) {
        camera.position.z += moveSpeed * Math.cos(yaw);
        camera.position.x += moveSpeed * Math.sin(yaw);
    }
    if (moveLeft) {
        camera.position.x -= moveSpeed * Math.cos(yaw);
        camera.position.z += moveSpeed * Math.sin(yaw);
    }
    if (moveRight) {
        camera.position.x += moveSpeed * Math.cos(yaw);
        camera.position.z -= moveSpeed * Math.sin(yaw);
    }

    camera.position.x = Math.max(limits.minX, Math.min(limits.maxX, camera.position.x));
    camera.position.y = Math.max(limits.minY, Math.min(limits.maxY, camera.position.y));
    camera.position.z = Math.max(limits.minZ, Math.min(limits.maxZ, camera.position.z));

    window.addEventListener('mousemove', (event) => {
        if (document.pointerLockElement === document.body) {
            const mouseX = event.movementX;
            const mouseY = event.movementY;

            yaw -= (mouseX * lookSpeed);
            pitch -= (mouseY * lookSpeed);
            pitch = Math.max(-Math.PI / 9, Math.min(Math.PI / 9, pitch));

            camera.rotation.set(pitch, yaw, 0);
        }
    });

    renderer.render(scene, camera);
}

animate();
