import axios from 'axios';
import cheerio from 'cheerio';

async function convertImageToBase64(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error('Error fetching or converting image:', error);
        return null;
    }
}

// Hàm xử lý nội dung HTML
async function processImgContent(htmlContent) {
    const $ = cheerio.load(htmlContent);

    const images = $('img');
    for (let i = 0; i < images.length; i++) {
        const src = $(images[i]).attr('src');
        if (src && src.startsWith('http')) {
            const base64Image = await convertImageToBase64(src);
            if (base64Image) {
                $(images[i]).attr('src', base64Image);
            }
        }
        // Không cần chuyển đổi nếu ảnh đã là Base64
    }

    const modifiedHtml = $('body').html();

    return modifiedHtml;
}

export default processImgContent