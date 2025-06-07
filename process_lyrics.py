import jieba.posseg as pseg

# 定义判断是否为标点符号的函数
def is_punctuation(word):
    return word in "，。！？、；：“”‘’（）《》〈〉「」『』…—～·"

# 判断词性并分配标签
def get_tag(flag):
    if flag.startswith('v') or flag.startswith('n') or '名' in flag or '动' in flag:
        return 'L'
    elif flag.startswith('a') or flag.startswith('d') or flag.startswith('m'):
        return 'M'
    else:
        return 'S'

# 处理单句中文歌词
def process_line(line):
    words = pseg.cut(line)
    result = ""
    for word, flag in words:
        if is_punctuation(word):
            result += word
        else:
            tag = get_tag(flag)
            result += f"<{tag}>{word}</{tag}>"
    return result

# 主程序逻辑
def process_lyrics(input_text):
    lines = input_text.strip().split('\n')
    output_lines = []
    i = 0
    while i < len(lines):
        main_line = lines[i].strip()
        second_line = lines[i + 1].strip() if i + 1 < len(lines) else ""

        if not main_line.startswith('[') or not second_line.startswith('['):
            i += 1
            continue

        # 提取 main 和 second 行的时间戳和类型
        time_stamp = main_line.split(']')[0] + ']'
        main_content = main_line.split(']')[-1]
        second_content = second_line.split(']')[-1]

        # 处理 main 行内容
        processed_main = process_line(main_content)

        # 构造输出行
        output_lines.append(f"{time_stamp}-main]{processed_main}")
        output_lines.append(f"{time_stamp}-second]{second_content}")

        i += 2

    return '\n'.join(output_lines)

if __name__ == "__main__":
    # 示例输入文本
    input_lyrics = """
        [03:25.05]也许我只能沉默
        [03:25.05]Maybe all I can do is stay silent

        [03:28.36]眼泪湿润眼眶
        [03:28.36]Tears wet my eyes

        [03:31.14]可又不甘懦弱
        [03:31.14]Yet I refuse to be weak
    """

    # 执行转换
    output = process_lyrics(input_lyrics)

    print(output)

    with open("processed_lyrics.txt", "w", encoding="utf-8") as f:
        f.write(output)