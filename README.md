# 歌词展示板

歌词文件要求：`main_language` `second_language` `main_text_color` `second_text_color`

四个属性放在文件开头的`<head></head>`标签里

- `main_language`：原歌词的语言
- `second_language` ：歌词翻译版本的语言
-  `main_text_color`原歌词文字的颜色
-  `second_text_color`：歌词翻译版本文字的颜色

在`<body></body>`中放置歌词内容，格式为：

```powershell
[hh:mm:ss-main]<原歌词内容加标签>
[hh:mm:ss-second]<歌词翻译版本内容加标签>
```

标签有四种类型，分别是`Large（大）`、`Medium（中）`和` Small（小）`

一个完整的歌词文件示例：

```
<head>
main_language=CN;
second_language=EN;
main_text_color=#F74C30;
second_text_color=#665250;
</head>
<body>
[00:25.45-main]<M>也许</M><L>世界</L><M>就</M><S>这样</S>
[00:25.45-second]Maybe the world is just like this
[00:28.59-main]<S>我</S><M>也</M><M>还</M><S>在</S><S>路上</S>
[00:28.59-second]I'm still on the way
[00:31.27-main]<L>没有</L><S>人能</S><L>诉说</L>
[00:31.27-second]There's no one to talk to
</body>
```





