# 海外项目app内嵌H5相关记录

## 任务中心

### 概要

页面入口：
- 任务中心：app -> me -> Earn Rewards
- 签到页面：app -> Library -> 顶部礼物和图标

代码位置：overseas -> `front/www_src/task-center-vue`

需求单： 
- [H5 - 任务中心（福利中心）](http://jira.ihuayue.cn/browse/DA-254)
- [h5 签到](http://jira.ihuayue.cn/browse/DA-251)


页面：
- 两个页面，一个是签到页面，一个是任务中心页面
- 任务中心页面的入口是固定的
- 签到页面，未签到则跳到签到页面，已签到则跳到任务中心页面


### 技术细节

具体的页面流程，不多说了，这里详细讲任务系统。

#### 任务数据

任务系统的每个任务，包括签到任务，都是一个任务,具体可以查看wiki[获取任务列表](http://wiki.ihuayue.cn/pages/viewpage.action?pageId=5669599)，有不懂的可以问问后台-周林

每个任务都有统一的字段，个别任务会有独立的字段，比如签到任务，每个字段的含义看上面的Wiki，这里拿签到任务举例：

**签到数据：**
``` json
{
    "id": "12",
    "name": "Check in",
    "info": "Check in to gain Bonus",
    "finfo": "Check in to gain Bonus",
    "type": 2,
    "taskType": "SIGNTASK",
    "task_extra": 0,
    "start_time": "",
    "end_time": "",
    "progress": 0,
    "add_time": 1551944536,
    "mod_time": 1563959976,
    "status": 2,
    "conds": "1",
    "cur_num": 0,
    "total": "36",
    "num": 1,
    "extra": {
        "total_num": 719,
        "total_date": 36,
        "list": [
            "30",
            0,
            0,
            1,
            0,
            0,
            0,
            0
        ]
    },
    "conds_name": "",
    "jump_info": "{}",
    "bootType": 3,
    "cur_times": 0,
    "is_fresh": 2,
    "pre_task": [],
    "position": 11,
    "reward": [
        17
    ],
    "total_num": 719,
    "total_date": 36,
    "list": {
        "1": {
            "status": 0,
            "num": 17
        },
        "2": {
            "status": 0,
            "num": 7
        },
        "3": {
            "status": 1,
            "num": 17
        },
        "4": {
            "status": 0,
            "num": 7
        },
        "5": {
            "status": 0,
            "num": 7
        },
        "6": {
            "status": 0,
            "num": 17
        },
        "7": {
            "status": 0,
            "num": 7
        }
    },
    "now_time": 1566807463,
    "tomorrow_num": 7,
    "sub": {
        "is_sub": false,
        "reward": 20,
        "resend": false
    }
}
```


**关键字段解释：**
- status: 任务公共字段，1=>任务没完成；2=>任务完成但未领取奖励，3=>任务完成且已领取奖励
- taskType: 表示该任务属于哪种类型的任务，签到任务：`SIGNTASK`；阅读任务：`READTIME`等
- task_extra： 完成任务的条件，如果是阅读任务，则单位是秒，如果是观看视频广告任务则单位是次。例如阅读任务的`task_extra=900`，则说明这个任务要阅读了900秒小说才达到完成条件。
- reward： 完成任务的奖励值
- jump_info： 任务的跳转信息标识（配置任务的时候前端定，由前端维护），比如阅读任务跳到书架或书城，邀请任务跳到拉新榜单H5页面
- position： 任务的优先级，数字越大优先级越高
- pre_task： 前置任务的任务id，如果这个任务有前置任务，则说明这个任务完成的判断条件是前置任务的转台，需要前置任务完成后这个任务才能完成。
- conds_name： 这个字段用来判断任务是服务端判断完成的还是由客户端判断完成的。
- info： 任务标题

上面的是我觉得比较关键的任务字段，有些任务可能会特殊一些，会有自己特有的字段，像签到任务就有`sign_info`、`sign_cur_month`、`list`、`total_num`等特有字段


#### 任务判断条件
上面页提到了任务分为两种类型：
- 服务端判断的任务，由服务端判断是否完成，拉取任务数据之后根据status的值判断就行
- 客户端判断的任务，这些任务需要结合客户端（app）本地记录的数据判断任务是否可以完成，比如阅读任务，阅读时长数据是客户端记录在本地的，服务端没有存储，就需要先从客户端获取阅读时长数据，再判断任务是否完成。

** 如何判断是哪端判断的任务？ **

这就需要看`conds_name`这个字段了，如果这个字段有值则说明这个任务是客户端判断的

这个字段是在任务管理后台配置任务的时候填写的，通常由前端填写，并由前端维护。

这个值不是乱写的，需要跟客户端（安卓和ios）的同事确定之后决定的，需要跟他们统一，哪个值代表什么数据。

这个是[任务-app保留字段](http://wiki.ihuayue.cn/pages/viewpage.action?pageId=8290357)，专门记录`conds_name`的

比如：每日加入书架数 用 `bookshelfNovelDay` 表示。。。


#### 任务判断逻辑

关键代码：`front/www_src/task-center-vue/src/store/modules/task.js -> getTaskProgress`

从服务端获取任务数据之后，调用`AppJsBridge.getTaskProgress`的js桥，从客户端获取记录的任务进度数据`taskProgress`。
``` javascript
// 非完整代码
AppJsBridge.getTaskProgress(taskProgress => {

    Object.values(checkTasks).forEach(task => {
        // 便利每个任务，如果任务是未完成状态（status=1） && 存在 conds_name 值，则根据值去拿到对应的进度数据
        // 处理客户端判断的任务
        if (+task.status === TASK_STATUS_UNFINISH && task.conds_name && taskProgress[task.conds_name]) {
            // 任务条件
            let taskExtra = +task.task_extra;
            // 客户端记录的任务进度
            let condsValue = taskProgress[task.conds_name];
            let progressArr = [];
            let progressStart = condsValue > taskExtra ? taskExtra : condsValue;
            let progressEnd = taskExtra;

            // 如果是阅读任务，进度单位需要改为分钟
            if (task.taskType === 'READTIME') {
                progressArr = [Math.floor(progressStart / 60), Math.floor(progressEnd / 60)];
            }
            else {
                progressArr = [progressStart, progressEnd];
            }

            commit('setTaskProgress', {
                id: task.id,
                progressArr
            });

            // 如果客户端记录的数据满足任务条件，则手动更改从服务端获取的任务数据的status值为2（可领取状态）
            if (condsValue >= taskExtra) {
                commit('changeTaskStatus', {
                    id: task.id,
                    status: TASK_STATUS_RECEIVE
                });
            }
        }
    });

    // 向客户端传递任务信息
    commit('postTaskH5');
});
```

#### 任务跳转逻辑

> 每个未完成的任务都有对应跳转去完成任务的操作，像充值任务就跳到充值中心页面，阅读任务就跳转到书城或者书架。
> 这些跳转的位置是由前端维护的，在任务管理后台配置任务的时候填写

获取任务之后，跳转的表示就记录在`jumpInfo.to`的字段中，

跳转位置记录在代码中：`front/www_src/task-center-vue/src/store/modules/task.js -> goToFinishTask`



#### 任务完成逻辑
关键代码：`front/www_src/task-center-vue/src/store/modules/task.js -> actions.finishTask`

v1.2版本在完成任务的接口加了签名校验，需要调用`AppJsBridge.encryptData`桥增加签名`sign`字段，主要目的是为了防止用户刷任务完成的接口



#### 跟客户端相关的任务交互
- getTaskProgress桥，从客户端获取任务进度数据
- encryptData桥，完成任务的加密签名
- postTaskH5桥，将任务数据传递给客户端，因为客户端页面也有处理任务的相关逻辑，正常情况下客户端只有在启动app的时候才会拉取任务数据，H5页面中有更改任务状态的任何操作之后都要及时的给客户端传递新的任务数据，像完成某一个任务之后就要调用这个桥通知客户端。
- pageActive桥，当H5页面回到激活状态的时候客户端会主动回调这个桥。

pageActive桥的应用场景：

例子：从任务H5页面点击 充值任务 跳转到 充值页面，用户在充值页面完成了充值操作并返回到 任务H5页面，这时就需要客户端告知H5页面已经回到H5了，H5才会做一些操作去重新判断充值任务是否完成。

任务中心中做的逻辑是：出发pageActive之后，如果任务是客户端判断的就重新调用`getTaskProgress`桥获取客户端进度数据；如果任务是服务端判断的则重新请求任务数据。最终的目的都是为了更改任务状态。



### 任务管理后台

> 任务管理后台可以查看、修改所有任务数据，可以根据用户qid查找该用户可以获取的所有任务信息。
> 不懂就问 后台-周林

测试环境：`test.activity.manager.ficfun.com`

预发或者线上环境： `activity.manager.dreame.com`



### 任务中心环境

因为测试环境没有https，所以所有H5页面的url和接口url都需要是http的，做如下更改：将https改为http

front/src/application/controllers/dreame_api/TaskController.php > getNewUserDialogAction
``` php
$task = 'http://'.$domain.'/Act/taskCenter?originProduct='.$this->originProduct.'#/task';
$sign = 'http://'.$domain.'/Act/taskCenter?originProduct='.$this->originProduct.'#/';
```



## js-bridge

代码位置：`js-bridge/src/oversea/dreame/`

这个是定义接口时跟客户端同时讨论的记录，最终以js-bridge项目中的代码为准

[js-bridge添加记录](http://wiki.ihuayue.cn/pages/viewpage.action?pageId=8290360)

最主要的方法是`src/_utils/jsbridge_adapter.js`这个文件里面的 `_call`和`_register`。

要增加或者修改js桥方法还是比较简单的，看以前的代码照猫画虎就OK，重要的是跟安卓和ios联调。

[要弄清楚具体怎么运行的话，还需要结合放在app内部的一份js代码](http://wiki.ihuayue.cn/pages/viewpage.action?pageId=8290372)

查看具体有什么js桥可以查看：[npm.ihuayue.cn](http://npm.ihuayue.cn/#/detail/@huayue/js-bridge)，
我是不建议看这个，直接看代码更快更全面，因为程序员一般都不喜欢写`README.md`文件。
我加的js桥都有写注释的，有些比较老的js桥没有注释就直接在overseas项目里面搜索一下看看以前是在什么场景下使用的。

目前发现两个平台处理逻辑不一致的js桥有：`getLocalCurrency` 和 `encryptData`。

新增js桥的时候，安卓和iOS的同事最好碰一下实现方式，最好做到统一。


## 前端错误上报 和 Kibana

> 为了更方便定位用户反馈的问题、发现bug和优化页面，会在页面中增加一些错误上报。
> 目前只有任务中心和拉新榜单活动添加了错误上报，后续可以把错误上报的代码封装更好一些，
> 所有PC站、wap站和H5都可以方便使用。或者跟老大说直接使用第三方的前端代码错误收集库，主要是要收费，哈哈哈！

前端QQ群里面有两个分享是跟前端监控和错误上报相关的ppt，错误上报的代码也是参考上面的内容实现的。

代码位置：`front/www_src/task-center-vue/src/utils/errorPost.js`

我简单封装了一下，[post-error-overseas](http://gitlab.ihuayue.cn/hyfe/post-error-overseas)

数据是上报到我们的[后台日志系统Kibana](http://172.31.62.16:8888/app/kibana#/discover)

![Kibana界面截图](http://file.ficfun.com/group1/M00/01/CA/rB84dl1kpIyAMmvaAADJ0QGlJ4w048.png)


Kibana平台的使用可以百度一下。后台负责人是 周林



## 神策打点

> 海外项目的数据埋点都是使用神策平台的，[官方文档](https://www.sensorsdata.cn/manual/js_sdk.html)
> 数据查看后台[http://bi.jingyu.com](http://bi.jingyu.com)

打点代码可以参考：
- H5：`overseas/front/www_src/task-center-vue/src/utils/track.js`
- wap站：`overseas/front/www_src/dreame/mobile/src/js/sensors/track.js`

个人建议是使用这个[打通 App 与 H5](https://www.sensorsdata.cn/manual/app_h5.html)，目前app内嵌H5没有使用这个。



## 各种H5活动

> H5活动一般指内嵌在app中的H5页面，代码一般放在`front/www_src/dreame/app`这个目录下面和`front/www_src/task-center-vue`这种以`vue`结尾的vue项目文件加里面

这个wiki记录了大部分H5页面的url[海外H5链接总汇](http://wiki.ihuayue.cn/pages/viewpage.action?pageId=7275860)

### 普通单页 
`front/www_src/dreame/app`这个目录里面的H5一般是相对比较简单的页面，一般只用zepto.js库实现。有动态渲染的页面一般使用`art-template`前端渲染模板。

需要注意：
- 新建页面之前先看目录下面的`README.md`文件和`gulpfile.js`文件，看完基本就知道构建流程了
- 目录里面有`cssLibs`和`jsLibs`目录，里面存放这一些公用的工具库。为了app内嵌H5页面样子跟app原生页面尽量详细，新建的H5页面最好需要引入`cssLibs/reset.styl`和`cssLibs/common.styl`样式文件。
- `cssLibs/common.styl`里面定义了两个字体：`Roboto-Regular`和`Roboto-Medium`，这个是UI设计确定的字体，只用这两个。不然UI大大会找你麻烦的。


### vue项目

`front/www_src/task-center-vue`这种的页面一般是使用vue框架实现的，功能逻辑可能会复杂一点点。

目前使用vue框架的页面：dreame任务中心、ficfun任务中心、拉新榜单活动、订阅页面 和 dreame-pc站 和 dreame-wap站通用的邮箱登陆注册模块。

vue项目的话就直接看`vue.config.js`和`package.json`配置就能懂的吧，我只想说的是字体方面，之后要改的时候或者新增vue项目的时候，字体要使用跟上面说的`Roboto-Regular`和`Roboto-Medium`，使用外链引入的字体，不然UI会找你麻烦的。

这里要说一下我做过的一个失败的尝试，只能说学艺不精吧。

活动做多了就会发现活动的一些UI样式和一些处理逻辑 是差不多的，像弹框、loading、处理错误逻辑、处理登录逻辑网络请求等都是一样的。
一个活动使用一个vue项目感觉有点繁琐，就想使用multi-page 模式将所有活动代码都写在一个vue项目里面，方便组件服用和代码管理。

遇到的问题：

多页打包的时候会将这个 页 不需要的依赖也打包进chunk-vendors.js文件中，造成js过大，加载比较慢。
简单地讲就是 A活动用到了一个第三方的插件，B活动没有用到，B活动加载的`chunk-vendors.js`文件中也包含那个插件，加载不需要的js.
当时对`webpack`还是一脸懵逼，其实现在也是。当时没办法进度太赶，就是把多页拆成多个vue项目。不过这个确实是有关解决方法的，就是微调一下`webpack`的打包过程。

参考：
- [vue-cli3多页应用配置与优化](https://www.cnblogs.com/HYZhou2018/p/10419703.html)
- [config.optimization.splitChunk](https://webpack.js.org/plugins/split-chunks-plugin/)


> 做H5活动的时候需要自行考虑使用哪种类型的页面，尽量然页面轻量一些，因为海外项目涉及的国家很广，一些不发达的国家像印度、菲律宾等网络环境很差的，可能加载一张图片都卡半天，而且他们使用的手机普遍较差，性能堪忧。主要是要想办法优化js的加载。

> vue项目一般上线执行的命令是 `npm run deploy`，这个命令不是固定的，只是现在都用这个。这个命令执行的逻辑是将vue项目打包出来的js和css上传到cdn，然后以外链的形式加载资源。

上传cdn的代码并且替换页面链接的代码基本用的是同一套。以任务中心为例：`overseas/front/www_src/task-center-vue/build/upload-cdn.js`


### 拉新榜单活动

- 需求链接：[【拉新活动】榜单](http://jira.ihuayue.cn/browse/DA-267)
- 代码位置：`overseas/front/www_src/dreameVue/invite`
- vue项目

### 召回活动

- 需求链接：[召回活动H5](http://jira.ihuayue.cn/browse/DA-341)
- 代码位置：`overseas/front/www_src/dreame/app/tpls/recallAct`
- 普通H5

### 新版首充活动

- 需求链接：这个是运营穿插的需求，没有需求链接。习惯就好。
- 代码位置：`overseas/front/www_src/dreame/app/tpls/chargeActNew`
- 普通H5

> 这个活动是旧版首充活动 微改后的新页面，主要改动的地方是，前端写死充值金额，并且加入`getLocalCurrency`js桥

### 订阅页面

- 需求链接：[H5 - 自动订阅](http://jira.ihuayue.cn/browse/DA-391)
- 代码位置：`overseas/front/www_src/dreameVue/bundle`
- vue项目

### 复充活动

- 需求链接：[H5 - 复充活动](http://jira.ihuayue.cn/browse/DP-74)
- 代码位置：`overseas/front/www_src/dreame/app/tpls/doubleRecharge`
- 普通H5


### 成为作者落地页

- 需求链接：[H5 - 成为作者的H5落地页](http://jira.ihuayue.cn/browse/DA-491)
- 代码位置：`overseas/front/www_src/dreame/app/tpls/toBeAuthor`
- 普通H5


### pc和wap站公用的邮箱登录模块

> 这个页面是wap站和pc站公用一套代码的，通过响应式展示两端不同的样式
> 构建的时候有一点点不同，有一个复制的操作，主要是pc站和wap站的静态文件目录不是同一个。
> 代码都是同一套，只是在将html、js和css文件输出到wap站的静态目录之后再将文件复制到pc站的静态目录。具体可以查看代码目录下面的`package.json`文件中的命令。

- 需求链接：[wap - 邮箱登录](http://jira.ihuayue.cn/browse/DA-447)
- 代码位置：`overseas/front/www_src/dreameVue/emailLogin`
- vue项目




## 奇技淫巧

> 这里是我在工作中的一些小经验和吐槽。

### app内嵌H5调试方法
- [腾讯X5内核调试](https://x5.tencent.com/tbs/guide/debug/season1.html)，只能调试安卓，iOS无能为力，网上也有window调试iOS webview的的博客教程，但是我尝试了两次都失败了。如果对iOS真的束手无策了就找ios同时跑Xcode然后再safari浏览器中调试把。
- 谷歌浏览器调试，方便快捷，就是电脑端一定要翻墙，不能调试iOS。（推荐）
- 类似`vconsole`的东西，dreame-app 1.3版本开始就因谷歌政策原因去除了X5内核改用安卓原生webview，这样的话，新版本中腾讯X5内核调试的方法估计不可用了。

** 其实内嵌appH5页面真的是很难调试，我也没有找到什么比较好的调试方法。X5内核调试也不好用，一些比较高端的手机根本调式不了，打开调试页面就是一片空白。`vconsole`只适用于简单的调式，复杂的调试真的很难，样式的话基本调不了。 **

** 对于不需要依赖客户端的js桥就能正常工作的H5页面最好就在浏览器上调试 **

``` html
<script src="//file.dreame.com/static/354992b06bcd4d326ac9a4187665f140/eruda.js"></script>
<script src="//file.dreame.com/static/ec534d7f1157e0689070c5e6bdc2049b/eruda-fps.js"></script>
<script>
    window.addEventListener('load',function () {
        eruda.init();
        eruda.add(erudaFps).show('fps');
    });
</script>
```

### 客户端会在webview中种的cookie值

安卓和iOS有点一致。iOS中没有种 `qid` 和 `osType`。iOS在v1.4版本中添加了。使用的时候要注意一下。

![](http://file.ficfun.com/group1/M00/01/CC/rB84XV1l5iiANuQbAABLPsFJCzc761.png)


### Dreame u和s base64解码

只做参考，最终以你自己解的为准

![](http://file.ficfun.com/group1/M00/01/CA/rB84XV1k4A-AEZSXAAAncd_CwFM430.png)

`bookshelfCount`：用户书架中的书的数量，v0.8版本加入。目的是实现：阅读任务跳转，书架有书就跳书架，没书就跳书城。
`newUserIndex`：用户是新手第几天，用户任务中心的新手任务。

### getUserInfo桥和getDeviceInfo桥获取的信息

只做参考，最终以你自己解的为准

![](http://file.ficfun.com/group1/M00/01/CA/rB84XV1k4SqAM2dmAABKCnWxIQs941.png)

后来还加了`interfaceCode`字段


### 发布系统

对发布系统有疑问就问 后台-周林

#### 前端发布配置

``` json
{
    "front/www_src/task-center-vue": [
        "front/src/application/views/dreame/api/tpls/app/taskCenter"
    ],
    "front/www_src/dreameVue/invite": [
        "front/src/application/views/dreame/api/tpls/app/dreameVue"
    ],
    "front/www_src/dreameVue/bundle": [
        "front/src/application/views/dreame/h5/tpls/dreameVue"
    ],
    "front/www_src/dreameVue/emailLogin": [
        "front/src/application/views/dreame/mobile/tpls/user/emailLoginVue.html",
        "front/src/application/views/dreame/pc/tpls/login/emailLoginVue.html"
    ],
    "front/www_src/task-center-ficfun-vue": [
        "front/src/application/views/dreame/api/tpls/app/taskCenterFicfun"
    ],
    "manager/src/www_src": [
        "manager/src/application/views/tpls/html/",
        "manager/src/www/css/",
        "manager/src/www/js/"
    ],
    "front/www_src/dreame/app": [
        "front/src/application/views/dreame/api/tpls/app/version1.0",
        "front/src/application/views/dreame/h5/tpls/singlePage"
    ],
    "front/www_src/dreame/pc": [
        "front/src/application/views/dreame/pc/tpls",
        "front/src/www/dreame/pc/js",
        "front/src/www/dreame/pc/style"
    ],
    "front/www_src/dreame/mobile": [
        "front/src/application/views/dreame/mobile/tpls",
        "front/src/www/dreame/mobile/css",
        "front/src/www/dreame/mobile/js",
        "front/src/www/dreame/mobile/manifest.json",
        "front/src/www/dreame/mobile/sw.js"
    ]
}
```

> 发布系统是根据git的diff对比来确定要发哪些文件的，对于前端来说是不好控制的。
> 因为前端上线不会发源代码文件，基本都发通过构建工具打包后的文件，这些文件就基本都是不放在版本库里面的，所以不能通过git对比得出哪些文件要发。
> 因此，就有了上面的前端发布配置文件。

配置文件的`key`是要构建的源码目录，`value`是一个数组，指定构建完之后要发布文件目录或者文件名（这些文件基本都是构建出来的，不在git仓库里面的）

创建上线单关键步骤：
- 发布的时候需要选择 前端发布
- 选择要发布的模块，就是`key`
- 要执行构建工具的命令

![](http://file.ficfun.com/group1/M00/01/CC/rB84XV1mFwOAYpqKAAAiqwEdtOw048.png)

有几点需要特别注意：
- 如果新增了一个新的项目文件夹 或者 发布的路径有改动，发布前就要更新这个配置数据，需要新增key和value，配置找 后台-周林 要
- 前端用的依赖（`package.json`）是经常会更改的，如果有更改发布的时候就需要先执行`npm install`命令然后再执行其他命令。发布系统正常是会帮我们判断`package.json`是否有更改的，有更改就会自动执行`npm install`操作。但是，发布系统有bug，不是每次都能准确判断，所以最稳妥的方法是显示的执行，类似：`npm install && npm run deploy`
- overseas 编译的镜像目录：测试机器的`/home/q/system/pubsys_webroot/2`这个目录，如果有什么东西要改的可以直接再这个目录里面更改。一般是创建一些目录 或者 发布失败 等情况下才会去这个目录做操作。



### 手动发布

> 有时在比较紧机的情况下会选择手动发布。比如节假日处理一些线上紧急的问题。对前端发布来说，手动发布和发布系统发布混用会造成一些混乱，最好只用发布系统发布。

命令：

``` 
env ENV_ONLINE=online sh deploy/deploy.sh [file1 file2 ...]
```

发布前命令最好找后台同事确认



### 清除缓存

Oversea线上的机器：
```
172.31.56.118
172.31.56.93
172.31.56.94
172.31.56.95
172.31.56.96
```

在预发机器直接 `ssh 172.31.56.118` 到线上机器，然后清除你要清除缓存的目录，都是不同路径下的`templates_c`目录

```
rm -f /home/q/system/overseas/front/src/application/views/dreame/pc/templates_c/*
```

有后台同事在就找后台的同事操作