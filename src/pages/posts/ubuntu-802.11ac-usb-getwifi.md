---
title: 802.11ac USB 接收 WIFI
description: 在 Ubuntu 系统使用 802.11ac USB WIFI 接收器接收并使用 WIFI
layout: ../../layouts/BlogPost.astro
tags:
  - Linux
heroImage: https://ahogek.com/uploads/img/20231029/wallhaven-jxl31y.png
imageWidth: 2340
imageHeight: 1080
createdAt: 2021/04/21 13:28:11
---

```shell
sudo apt update
sudo apt install build-essential git dkms
git clone https://github.com/brektrou/rtl8821CU.git
cd rtl8821CU
chmod +x dkms-install.sh
sudo ./dkms-install.sh
sudo modprobe 8821cu
reboot
```

重启结束后就可以看到 usb wifi

![img](https://ahogek.com/uploads/img/20231029/20210421132506194.png)
