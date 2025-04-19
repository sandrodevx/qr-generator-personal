document.addEventListener('DOMContentLoaded', () => {
    const qrText = document.getElementById('qr-text');
    const generateBtn = document.getElementById('generate-btn');
    const qrColor = document.getElementById('qr-color');
    const bgColor = document.getElementById('bg-color');
    const qrSize = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const logoUpload = document.getElementById('logo-upload');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeElement = document.getElementById('qr-code');

    let qrCode = null;
    let logoImage = null;

    // Actualizar valor del tamaño
    qrSize.addEventListener('input', () => {
        sizeValue.textContent = qrSize.value;
    });

    // Subir logo
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoImage = event.target.result;
                generateQRCode();
            };
            reader.readAsDataURL(file);
        }
    });

    // Generar QR
    generateBtn.addEventListener('click', generateQRCode);

    function generateQRCode() {
        const text = qrText.value || 'https://youtube.com';
        const size = parseInt(qrSize.value);
        const color = qrColor.value;
        const bg = bgColor.value;

        qrCodeElement.innerHTML = '';

        qrCode = new QRCode(qrCodeElement, {
            text: text,
            width: size,
            height: size,
            colorDark: color,
            colorLight: bg,
            correctLevel: QRCode.CorrectLevel.H
        });

        // Añadir logo si existe
        if (logoImage) {
            setTimeout(() => {
                const img = qrCodeElement.querySelector('img');
                if (img) {
                    const logoSize = size / 4;
                    const logo = document.createElement('img');
                    logo.src = logoImage;
                    logo.style.position = 'absolute';
                    logo.style.width = `${logoSize}px`;
                    logo.style.height = `${logoSize}px`;
                    logo.style.borderRadius = '8px';
                    qrCodeElement.appendChild(logo);
                }
            }, 100);
        }
    }

    // Descargar QR
    downloadBtn.addEventListener('click', () => {
        if (qrCodeElement.querySelector('img')) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const qrImg = qrCodeElement.querySelector('img');
            const logoImg = qrCodeElement.querySelector('img:last-child');

            canvas.width = qrImg.width;
            canvas.height = qrImg.height;

            // Dibujar QR
            ctx.drawImage(qrImg, 0, 0);

            // Dibujar logo (si existe)
            if (logoImg) {
                const logoSize = qrImg.width / 4;
                const center = (qrImg.width - logoSize) / 2;
                ctx.drawImage(logoImg, center, center, logoSize, logoSize);
            }

            // Crear enlace de descarga
            const link = document.createElement('a');
            link.download = 'mi-qr-personalizado.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    });

    // Generar QR al cargar la página
    generateQRCode();
});