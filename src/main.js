const mainLyricsElement = document.getElementById('main-lyrics');
const secondLyricsElement = document.getElementById('second-lyrics');
let lyricsData = [];
let currentIndex = 0;
let startTime;
let mainColor, secondColor;
let mainLanguage, secondLanguage;

function parseLyrics(lyricsText) {
    const lines = lyricsText.split('\n');
    let inBody = false;
    const result = [];

    lines.forEach(line => {
        if (line.includes('<head>')) {
            return;
        } else if (line.includes('</head>')) {
            return;
        } else if (line.includes('<body>')) {
            inBody = true;
            return;
        } else if (line.includes('</body>')) {
            inBody = false;
            return;
        }

        if (line.includes('main_language')) {
            mainLanguage = line.split('=')[1].replace(';', '').trim();
        } else if (line.includes('second_language')) {
            secondLanguage = line.split('=')[1].replace(';', '').trim();
        } else if (line.includes('main_text_color')) {
            mainColor = line.split('=')[1].replace(';', '').trim();
        } else if (line.includes('second_text_color')) {
            secondColor = line.split('=')[1].replace(';', '').trim();
        }

        if (inBody) {
            const mainMatch = line.match(/\[(\d{2}:\d{2}\.\d{2})-main\](.*)/);
            const secondMatch = line.match(/\[(\d{2}:\d{2}\.\d{2})-second\](.*)/);

            if (mainMatch) {
                // 移除标签
                let text = mainMatch[2].replace(/<\/?[MLS]>/g, '');
                result.push({
                    time: mainMatch[1],
                    type: 'main',
                    text: text,
                    originalText: mainMatch[2]
                });
            } else if (secondMatch) {
                result.push({
                    time: secondMatch[1],
                    type: 'second',
                    text: secondMatch[2]
                });
            }
        }
    });

    console.log(`第一语言为${mainLanguage}，第二语言为${secondLanguage}`);
    return result;
}

function timeToSeconds(time) {
    const match = time.match(/^(\d{2}):(\d{2}\.\d{2})$/);
    if (!match) {
        console.error('时间格式错误:', time);
        return 0;
    }
    const [, minutes, seconds] = match;
    return parseInt(minutes) * 60 + parseFloat(seconds);
}

function updateLyrics(timestamp) {
    if (!startTime) {
        startTime = timestamp;
    }

    const elapsedTime = (timestamp - startTime) / 1000;
    while (currentIndex < lyricsData.length && elapsedTime >= timeToSeconds(lyricsData[currentIndex].time)) {
        const item = lyricsData[currentIndex];
        if (item.type === 'main') {
            mainLyricsElement.innerHTML = ''; 
            const regex = /<([MLS])>(.*?)<\/\1>/g;
            let match;
            let lastIndex = 0;
            while ((match = regex.exec(item.originalText)) !== null) {
                // 添加匹配前的文本
                const textBefore = item.originalText.slice(lastIndex, match.index);
                textBefore.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    if (/[\u4e00-\u9fa5]/.test(char)) {
                        span.style.fontFamily = '字库星球飞扬体';
                    } else {
                        span.style.fontFamily = 'Acosta';
                    }
                    mainLyricsElement.appendChild(span);
                });

                // 添加匹配的文本并设置类
                const tag = match[1];
                const text = match[2];
                text.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    if (/[\u4e00-\u9fa5]/.test(char)) {
                        span.style.fontFamily = '字库星球飞扬体';
                    } else {
                        span.style.fontFamily = 'Acosta';
                    }
                    // 根据标签添加类
                    if (tag === 'L') {
                        span.classList.add('L');
                    } else if (tag === 'M') {
                        span.classList.add('M');
                    } else if (tag === 'S') {
                        span.classList.add('S');
                    }
                    mainLyricsElement.appendChild(span);
                });

                lastIndex = regex.lastIndex;
            }

            // 添加剩余的文本
            const textAfter = item.originalText.slice(lastIndex);
            textAfter.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                if (/[\u4e00-\u9fa5]/.test(char)) {
                    span.style.fontFamily = '字库星球飞扬体';
                } else {
                    span.style.fontFamily = 'Acosta';
                }
                mainLyricsElement.appendChild(span);
            });

            mainLyricsElement.style.color = mainColor;
        } else if (item.type === 'second') {
            secondLyricsElement.innerHTML = ''; 
            const chars = item.text.split('');
            chars.forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                if (/[\u4e00-\u9fa5]/.test(char)) {
                    span.style.fontFamily = '字库星球飞扬体';
                } else {
                    span.style.fontFamily = 'Acosta';
                }
                secondLyricsElement.appendChild(span);
            });
            secondLyricsElement.style.color = secondColor;
        }
        currentIndex++;
    }

    requestAnimationFrame(updateLyrics);
}

document.getElementById('lrcFile').addEventListener('change', function(e) {
    // 清空当前显示的歌词
    mainLyricsElement.innerHTML = '';
    secondLyricsElement.innerHTML = '';
    // 重置进度状态
    lyricsData = [];
    currentIndex = 0;
    startTime = null;

    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function() {
            lyricsData = parseLyrics(reader.result);
        };

        reader.readAsText(file);
    }
});

window.start = function() {
    if (lyricsData.length === 0) {
        alert('请先选择歌词文件');
        return;
    }
    // 计算第一个歌词出现的时间（秒）
    const firstLyricTime = timeToSeconds(lyricsData[0].time);
    let remainingTime = firstLyricTime;

    // 开始倒计时
    const countdownInterval = setInterval(() => {
        console.log(`距离第一个歌词出现还有 ${remainingTime} 秒`);
        remainingTime--;
        if (remainingTime < 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    currentIndex = 0;
    startTime = null;
    requestAnimationFrame(updateLyrics);
};