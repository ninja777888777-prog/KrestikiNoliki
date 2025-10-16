const cubes = document.querySelectorAll('[class^="cube"]');

function setupCubeToggle(cubeElement) {
    let clickCount = 0;
    
    cubeElement.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 1) {
            cubeElement.style.backgroundImage = 'url("./img/null.png")';
            cubeElement.style.backgroundSize = '300px 300px'
        } else if (clickCount === 2) {
            cubeElement.style.backgroundImage = 'url("./img/krestik.png")';
            cubeElement.style.backgroundSize = '220px 220px'
        } else if (clickCount === 3) {
            cubeElement.style.backgroundImage = 'none';
            clickCount = 0; 
        }
    });
}

cubes.forEach(cube => {
    setupCubeToggle(cube);
});