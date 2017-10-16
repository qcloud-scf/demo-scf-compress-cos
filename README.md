# 说明

本 Demo 为使用腾讯云 SCF 无服务器云函数压缩 COS 对象存储内目录并生成 zip 压缩文件。


# 使用方式

1. 修改 cos.js 内开头部分为自身腾讯云帐号的 APPId，SecretId，SecreteKey。
2. 压缩项目下的所有文件为一个 zip 文件，例如`compress.zip`，确保 index.js 位于 zip 文件内的根目录。
3. 在腾讯云 SCF 无服务器云函数控制台创建新函数，根据您的需要命名函数名，例如 `test_compress`，运行环境选择 `Nodejs 6.10`。
4. 代码输入方式使用`本地上传zip包`，并在函数代码包位置选择 “步骤2” 创建的压缩文件。完成函数创建。
5. 使用如下测试模版测试函数运行，其中region标识bucket地域，bucket标识需处理的bucket桶，source标识需要处理的bucket内的目录，zipfile标识期望生成的zip文件名：
```
{
"region":"ap-guangzhou",
"bucket":"testzip",
"source":"pic/",
"zipfile":"pic.zip"
}
```

可通过《[使用SCF云函数压缩COS文件](使用SCF云函数压缩COS文件.md)》文章来查看更详细的说明。

