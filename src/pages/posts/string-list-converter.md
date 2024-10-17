---
title: String 转 List
description: Java8逗号分隔字符串转列表及列表转逗号分隔字符串操作
layout: ../../layouts/BlogPost.astro
tags:
  - Java
heroImage: /string-list-converter.png
imageWidth: 1205
imageHeight: 1920
createdAt: 2021/04/01 14:10:18
---

> 算是工作中比较常用的操作，记录一下

### 逗号分隔字符串转列表

![在这里插入图片描述](https://ahogek.com/uploads/img/20231029/20210401110024955.png)

通过 `String` 的 `split()` 将字符串分割成数组，然后通过 `Stream.of()` 将数组转为 Java8 的 stream 流然后进行正常的流操作再通过 `collect(Collectors.toList())` 转为 List

### 列表转逗号分隔字符串

![img](https://ahogek.com/uploads/img/20231029/20210401140900837.png)

这个操作只需要在 `collect()` 方法中使用 `Collectors.joining(",")` 即可
