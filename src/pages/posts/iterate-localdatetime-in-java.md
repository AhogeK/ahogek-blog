---
title: Java 遍历 LocalDateTime 两个时间段中的每一天
description: 使用 Java8 中的 ChronoUnti 实现两个不同日子的 LocalDateTime 的每一天
layout: ../../layouts/BlogPost.astro
tags:
  - Java
heroImage: /java.png
imageWidth: 2048
imageHeight: 1152
createdAt: 2021/03/31 16:30:46
---

![img](/20210331163010597.png)

当中的 ``ChronoUnit.DAYS.between(startDate, endDate)`` 就可以取到 startDate endDate 之间相隔的天数

这样就可以通过 for 循环遍历，可以通过 ``LocalDateTime`` 的 ``plusDays()`` 方法得到每天的 LocalDateTime
