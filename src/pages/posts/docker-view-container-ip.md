---
title: Docker 查看容器 IP
description: 利用 Docker inspect 指令查看 Docker 容器中的 IP
layout: ../../layouts/BlogPost.astro
tags:
  - Docker
heroImage: https://ahogek.com/uploads/img/20230516/wallhaven-yxe3jk.jpg
---

> 在 Docker 指令中有一个 `inspect` 可以查看容器的详细信息，只需要

`docker inspect [容器id或名称]`

就可以显示一大串 JSON 数据，其中就包括了 _镜像_ _容器_ _网络_ 等信息。其中 **NetworkSettings**中有一个 **IPAddress** 属性便是 容器的 ip 地址
所以有一个好方法就是使用 `--format` 来直接获取

`docker inspect --format '{{ .NetworkSettings.IPAddress }}' redis`

这样就能直接获取到容器名为 redis 的容器的 ip 地址
