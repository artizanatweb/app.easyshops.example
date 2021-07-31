class ImageReader {
    constructor(imagePath = '/assets/svgs/default-image.svg', readyState = 2) {
        this.result = imagePath;
        this.readyState = readyState;
        this.synthetic = true;
    }
}

export default ImageReader;
