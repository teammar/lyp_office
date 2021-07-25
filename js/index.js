function req(params, headers) {
    params.type = params.type || 'GET';
    params.data = params.data || {};
    headers = headers || {};
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: headers,
            type: params.type,
            url: params.url,
            dataType: params.dataType || 'json',
            data: params.data,
            success(res) {
                resolve(res);
            },
            error(e) {
                reject(e);
            }
        })
    });
}

function reqSync(params) {
    let data = null;
    $.ajax({
        async: false,
        url: params.url,
        dataType: params.dataType || 'json',
        success(res) {
            data = res;
        }
    });
    return data;
}

class TeamMember {
    constructor(qq, nickName, describe) {
        this.qq = qq;
        this.avatar = this.getHeadImg(qq);
        this.nickName = nickName;
        this.describe = describe;
        this.openQQ = this._openQQ();
    }

    getHeadImg(qq) {
        return `http://q.qlogo.cn/headimg_dl?dst_uin=${qq}&spec=640&img_type=jpg`
    }

    _openQQ() {
        return function () {
            req({url: 'https://api.iyk0.com/qqdh?qq=' + this.qq});
        };
    }
}

function newP(qq, describe) {
    return new Promise((resolve, reject) => {
        req({url: 'https://api.iyk0.com/qname/?qq=' + qq, dataType: 'text'})
            .then(res => {
                console.log("nickName", res);
                resolve(new TeamMember(qq, res, describe));
            }).catch(e => {
            reject(e);
        });
    });
}

function getHistory() {
    req({url: 'https://cdn.lyplus.cc/api.php?path=lyp/updateHistory.json'}).then(res => {
        let list = [];
        for (const ver of res.list.reverse()) {
            list.push({
                pic: './img/logo.png',
                name: res[ver].version + "-" + (compare(res[ver].version, '1.1.1.7') >= 0 ? 'bate' : 'alpha'),
                downUri: res[ver].fullDown,
                body: res[ver].describe
            });
        }
        Promise.all(list).then(res => {
            if (res && res.length > 0) {
                let $sevice = $('.services-section .wrapper .services-list').empty();
                res.forEach(item => {
                    $sevice.append(`<li>
                    <div class="image-container">
                        <img src="${item.pic}" alt="${item.name}">
                    </div>
                    <h5>${item.name}</h5>
                    <p style="text-align:left;" title="${item.body}">${item.body.substr(0, 100).replace(/\n/g, '<br>') + '...'}</p>
                    <a href="https://api.iyk0.com/lzyjx/?url=${item.downUri}&type=down" target="_blank">下载</a>
                    </li>`);
                });
                $sevice.append('<div class="clear"></div>');
                $('#top #navigation .nav-cta').prop('href', `https://api.iyk0.com/lzyjx/?url=${res[0].downUri}&type=down`).prop('target', '_blank');
                $('#banner .wrapper .buttons .button-1').prop('href', `https://api.iyk0.com/lzyjx/?url=${res[0].downUri}&type=down`).prop('target', '_blank');
            }
        }).catch(e => {
            alert(e);
        })
    })
}

$(document).ready(function () {

    // 加载应用中心
    $('#banner .wrapper .buttons .button-2').unbind().click(function () {
        window.open('http://lyp.ffstu.cn/apps/cn.ffstu.lyp.appstore/', 'newwindow', 'width=1024,height=600,toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,resizable=yes,dependent=yes')
    });

    // 加载历史版本
    getHistory();

    // 加载团队
    Promise.all([
        newP('929461848', '框架设计、开发'),
        newP('2639068583', '易语言相关技术支持'),
        newP('2822569653', '提供配套接口'),
        newP('1872605420', '应用中心的UI开发'),
        newP('1723260175', '小羽客服'),
        newP('1562636521', '小栗子插件作者窗口人'),
    ]).then(res => {
        console.log(res);
        let $team = $('.team-section .wrapper .team-list').empty();
        res.forEach(item => {
            $team.append(`<li>
                <div class="image-container">
                    <img src="${item.avatar}" alt="services icon">
                </div>
                <h5>${item.nickName}</h5>
                <p title="${item.describe}">${item.describe.substr(0, 100).replace(/\n/g, '<br>')}</p>
                    <ul class="social-links">
                        <li title="点击这里联系他"><a class="qq" target="_blank" href="https://api.iyk0.com/qqdh?qq=${item.qq}">QQ</a></li>
                    </ul>
                </li>`);
        });
        $team.append('<div class="clear"></div>');
    }).catch(e => {
        console.log(e)
    });


    // 加载小羽秀
    let pics = [
        './img/login.png',
        './img/home.png',
        './img/log.png',
        './img/setting.png',
        './img/console.png',
        './img/rabbit.png',
        './img/appstore.png',
    ]
    let $show = $('.portfolio-section .portfolio-list').empty();
    pics.forEach(item => {
        $show.append(`<li class="item">
        <a href="${item}" data-featherlight="${item}" class="photo-overlay">
            <img src="${item}" alt="">
        </a>
        </li> `);
    });
    $show.append('<div class="clear"></div>');

    // 加载用户协议
    $('footer a.policy').css('cursor', 'pointer').unbind().click(function () {
        let $p = $('#policy');
        $p.show().find('.content').html(getUserPolicy().replace(/\n/g, '<br>'));
        $('.policy-close').unbind().click(function () {
            $p.hide();
        });
    });
});

function compare(localVer, ver) {
    var ls = localVer.split(".");
    var vs = ver.split(".");
    for (var idx in ls) {
        if (ls[idx] && vs[idx]) {
            if (parseInt(ls[idx]) > parseInt(vs[idx])) {
                return 1;
            } else if (parseInt(ls[idx]) < parseInt(vs[idx])) {
                return -1;
            }
        } else if (ls[idx]) {
            return 1;
        } else if (vs[idx]) {
            return -1;
        }
    }
    return 0;

}

function getUserPolicy() {
    return `
    =========用户协议=========
软件许可及服务协议
欢迎使用小羽+软件及服务（以下简称“服务”）！

提示：在使用服务之前，您应当认真阅读并遵守《服务条款》以及《隐私政策》，请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、争议解决和法律适用条款。免除或者限制责任的条款可能将以加粗字体显示，您应重点阅读。
      当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，或您按照软件提示填写信息、阅读并同意本协议且继续使用服务，或您以其他小羽+允许的方式实际使用本服务时，即表示您已充分阅读、理解并接受本协议的全部内容。除非你已阅读并接受本协议所有条款，否则你无权使用本软件及相关服务。

除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。您的下载、安装、使用、登录等行为即视为您已阅读并同意本协议的约束。

如果您未满18周岁，请在法定监护人的陪同下阅读本协议，并特别注意未成年人使用条款。

一、【协议的范围】
1.1【协议适用主体范围】
本协议是用户（以下可称为“您”）与小羽+之间关于下载、安装、使用、登录本软件，以及使用本服务所订立的协议。

二、【关于本服务】
2.1 本服务的内容
本服务内容是指小羽+系列网站向用户提供的帐号注册、交流分享、应用发布等服务，及小羽+提供的各种形式软件的许可及服务。

2.2 本服务的形式
你使用本服务可能需要注册帐号、访问小羽+系列网站并下载小羽+相关软件，对于这些软件，小羽+给予你一项个人的、不可转让及非排他性的许可。你仅可为访问或使用本服务的目的而使用这些软件及服务。

2.3 本服务许可的范围
2.3.1  小羽+给予你一项个人的、不可转让及非排他性的许可，以使用本软件。你可以为非商业目的在您持有或合法获得授权的终端设备上安装、使用、显示、运行本软件。

2.3.2 你可以为使用本软件及服务的目的复制本软件的一个副本，仅用作备份。备份副本必须包含原软件中含有的所有著作权信息。

2.3.3 本条及本协议其他条款未明示授权的其他一切权利仍由小羽+保留，你在行使这些权利时须另外取得小羽+的书面许可。小羽+如果未行使前述任何权利，并不构成对该权利的放弃。

三、【软件的获取】
3.1 你可以直接从小羽+的网站上获取本软件，也可以从得到小羽+授权的第三方获取。

3.2 如果你从未经小羽+授权的第三方获取本软件或与本软件名称相同的安装程序，小羽+无法保证该软件能够正常使用，并对因此给你造成的损失不予负责。

四、【软件的安装与卸载】
4.1 小羽+可能为不同的终端设备开发了不同的软件版本，你应当根据实际情况选择下载合适的版本进行安装。
4.2 下载安装程序后，你可能需要按照该程序提示的步骤正确安装。
4.3 为提供更加优质、安全的服务，在本软件安装时小羽+可能会包括其他应用，你可以选择卸载这些应用。
4.4 如果你不再需要使用本软件或者需要安装新版软件，可以自行卸载。如果你愿意帮助小羽+改进产品服务，请告知卸载的原因。
五、【软件的更新】
5.1 为给用户提供更加强大的功能、更加稳定的性能，小羽+将会不断开发新的服务，并会不时为您提供软件的更新（这些更新可能会采取软件替换、修改、功能强化、版本升级等形式）。
5.2 为了保证本软件及服务的安全性和功能的一致性，小羽+有权在不向你特别通知的情况下对软件进行更新，或者对软件的部分功能效果进行改变或限制。
5.3 本软件在最新版本发布后，将不会保证旧版软件一定可以使用。如最新版本发布后，你发现旧版软件无法使用，请更新为最新版本即可（如无法更新请于官网下载最新版本）。
六、【用户个人信息保护】
6.1 保护用户个人信息是小羽+的一项基本原则，小羽+将会采取合理的措施保护用户的个人信息。除法律法规规定的情形外，未经用户许可小羽+不会向第三方公开、透露用户个人信息。
6.2 你在注册帐号或使用本服务的过程中，需要提供一些必要的信息，例如：为向你提供帐号注册服务或进行用户身份识别，需要你填写手机号码。若国家法律法规或政策有特殊规定的，你需要提供真实的身份信息。若你提供的信息不完整，则无法使用本服务或在使用过程中受到限制。
6.3 一般情况下，你可随时浏览、修改自己提交的信息，但出于安全性和身份识别的考虑，你可能无法修改注册时提供的初始注册信息及其他验证信息。
6.4 未经你的同意，小羽+不会向小羽+以外的任何公司、组织和个人披露你的个人信息，但法律法规另有规定的除外。
6.5 小羽+非常重视对未成年人个人信息的保护。若你是18周岁以下的未成年人，在使用小羽+的服务前，应事先取得你家长或法定监护人的书面同意。
七、【主权利义务条款】
7.1 帐号使用规范
7.1.1 你在使用本服务前需要拥有小羽+帐号及相关平台账号等。您须遵守该帐号所属平台的相关规则。

7.1.2 小羽+帐号的所有权归小羽+团队所有，用户完成申请注册手续后，仅获得小羽+帐号的使用权，且该使用权仅属于初始申请注册人。同时，初始申请注册人不得赠与、借用、租用、转让或售卖小羽+帐号或者以其他方式许可非初始申请注册人使用小羽+帐号。非初始申请注册人不得通过受赠、继承、承租、受让或者其他任何方式使用小羽+帐号。

7.1.3 用户有责任妥善保管注册帐户信息及帐户密码的安全，用户需要对注册帐户下的行为承担法律责任。用户同意在任何情况下不向他人透露帐户及密码信息。当在你怀疑他人在使用你的帐号时，你应立即通知小羽+团队。

7.1.4 用户注册小羽+帐号后如果长期不登录该帐号，小羽+有权回收该帐号，以免造成资源浪费，由此带来的任何损失均由用户自行承担。

7.2 用户注意事项
7.2.1 你理解并同意：为了向你提供有效的服务，本服务会利用你终端设备的处理器和带宽等资源。本服务使用过程中可能产生数据流量的费用，用户需自行向运营商了解相关资费信息，并自行承担相关费用。

7.2.2 你理解并同意：服务的某些功能可能会让第三方知晓用户的信息，例如：社区用户可以查询其他用户头像、用户名等公开的个人资料。

7.2.3 你在使用小羽+的某一特定服务时，该服务可能会另有单独的协议、相关业务规则等（以下统称为“单独协议”），你在使用该项服务前请阅读并同意相关的单独协议。

7.2.4 你理解并同意小羽+将会尽其合理努力保障你在本软件及服务中的数据存储安全，但是，小羽+并不能就此提供完全保证，包括但不限于以下情形：

  1.小羽+不对你在本软件及服务中相关数据的删除或储存失败负责；

  2.小羽+有权根据实际情况自行决定单个用户在本软件及服务中数据的最长储存期限，并在服务器上为其分配数据最大存储空间等；

  3.如果你停止使用本软件及服务或服务被终止或取消，小羽+可以从服务器上永久地删除你的数据。服务停止、终止或取消后，小羽+没有义务向你返还任何数据。

7.2.5 用户在使用本软件及服务时，须自行承担如下来自小羽+不可掌控的风险内容，包括但不限于：

  1.由于不可抗拒因素可能引起的个人信息丢失、泄漏等风险；

  2.用户必须选择与所安装终端设备相匹配的软件版本，否则，由于软件与终端设备型号不相匹配所导致的任何问题或损害，均由用户自行承担；

  3.用户在使用本软件访问第三方网站时，因第三方网站及相关内容所可能导致的风险，由用户自行承担；

  4.用户发布的内容被他人转发、分享，因此等传播可能带来的风险和责任；

  5.由于无线网络信号不稳定、无线网络带宽小等原因，所引起的小羽+登录失败、软件运行异常等风险。

7.2.6 您理解并同意，小羽+是一款智能机器人产品，并非即时通讯工具，其安全标准、功能架构、设计、测试均以在公开环境下供其他用户使用的智能机器人为前提。您不得将小羽+用作您个人或团体的通讯工具，也不得使用小羽+处理涉密信息，否则，由于软件设计用途与用户实际用途偏差所导致的任何问题或损害，均由用户自行承担。

7.3 第三方应用和服务
7.3.1 你在使用本软件第三方提供的应用或服务时，除遵守本协议约定外，还应向第三方了解并遵守其用户协议。第三方提供的应用并非小羽+开发或维护，小羽+无法对第三方应用导致的问题或损害承担责任。小羽+和第三方对可能出现的纠纷在法律规定和约定的范围内各自承担责任。

7.3.2 因用户使用本软件或要求小羽+提供特定服务时，本软件可能会调用第三方系统或者通过第三方支持用户的使用或访问，使用或访问的结果由该第三方提供（包括但不限于第三方的应用等），小羽+不保证通过第三方提供应用及内容的安全性、准确性、有效性及其他不确定的风险，由此若引发的任何争议及损害，与小羽+无关，小羽+不承担任何责任。

7.3.3 你理解并同意，小羽+有权决定将本软件作商业用途，包括但不限于开发、使用本软件的部分服务为第三方作推广等，小羽+承诺在推广过程中严格按照本协议约定保护你的个人信息，同时你亦可以根据系统设置选择屏蔽、拒绝接收相关推广信息。

八、【用户行为规范】
8.1 信息内容规范
8.1.1 本条所述信息内容是指用户使用本软件及服务过程中所制作、复制、发布、传播的任何内容，包括但不限于小羽+帐号头像、名字、用户说明等注册信息，或发送的文字、语音、图片、网页链接、音乐链接等信息，以及其他使用小羽+帐号或本软件及服务所产生的内容。

8.1.2 你理解并同意，小羽+一直致力于为用户提供文明健康、规范有序的网络环境，你不得利用小羽+帐号或本软件及服务制作、复制、发布、传播如下干扰小羽+正常运营，以及侵犯其他用户或第三方合法权益的内容，包括但不限于：

  一、发布、传送、传播、储存违反国家法律法规禁止的内容：

    1.违反宪法确定的基本原则的；

    2.危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；

    3.损害国家荣誉和利益的；

    4.煽动民族仇恨、民族歧视，破坏民族团结的；

    5.破坏国家宗教政策，宣扬邪教和封建迷信的；

    6.散布谣言，扰乱社会秩序，破坏社会稳定的；

    7.散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；

    8.侮辱或者诽谤他人，侵害他人合法权益的；

    9.煽动非法集会、结社、游行、示威、聚众扰乱社会秩序；

    10.以非法民间组织名义活动的；

    11.不符合《即时通信工具公众信息服务发展管理暂行规定》及遵守法律法规、社会主义制度、国家利益、公民合法利益、公共秩序、社会道德风尚和信息真实性等“七条底线”要求的；

    12.含有法律、行政法规禁止的其他内容的。

  二、发布、传送、传播、储存侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的内容；

  三、涉及他人隐私、个人信息或资料的；

  四、发表、传送、传播骚扰、广告信息、过度营销信息及垃圾信息或含有任何性或性暗示的；

  五、《小羽+应用发布、使用规范》（位于小羽+社区“插件中心”板块置顶公告）中禁止的行为；

  六、《小羽+社区管理条例》（位于小羽+社区“社区公告”板块置顶公告）中禁止的行为；

  七、其他违反法律法规、政策及公序良俗、社会公德或干扰小羽+正常运营和侵犯其他用户或第三方合法权益内容的信息。

8.2 软件使用规范
8.2.1 除非法律允许或小羽+书面许可，你使用本软件过程中不得从事下列行为：

  1.删除本软件及其副本上关于著作权的信息；

  2.对本软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件的源代码；

  3.对小羽+拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等；

  4.对本软件或者本软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及本软件运行所必需的系统数据，进行复制、修改、增加、删除；

  5.对本软件或者本软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及本软件运行所必需的系统数据，进行复制、修改、增加、删除；

  6.通过非小羽+开发、授权的第三方软件、插件、外挂、系统，登录或使用小羽+软件及服务，或制作、发布、传播上述工具；

  7.自行或者授权他人、第三方软件对本软件及其组件、模块、数据进行干扰；

  8.其他未经小羽+明示授权的行为。

8.2.2 你理解并同意，基于用户体验、小羽+或相关服务平台运营安全、平台规则要求及健康发展等综合因素，小羽+有权选择提供服务的对象，有权决定功能设置，有权决定功能开放、数据接口和相关数据披露的对象和范围。针对以下情形，有权视具体情况中止或终止提供本服务，包括但不限于：

  1.违反法律法规或本协议规定的；

  2.影响服务体验的；

  3.存在安全隐患的；

  4.与小羽+或其服务平台已有主要功能或功能组件相似、相同，或可实现上述功能或功能组件的主要效用的；

  5.界面、风格、功能、描述或使用者体验与小羽+或其服务平台类似，可能造成小羽+用户认为其所使用的功能或服务来源于小羽+或经小羽+授权的；

  6.违背小羽+或其服务平台运营原则，或不符合小羽+其他管理要求的。

8.3 服务运营规范
除非法律允许或小羽+书面许可，你使用本服务过程中不得从事下列行为：

  1.提交、发布虚假信息，或冒充、利用他人名义的；

  2.诱导其他用户点击链接页面或分享信息的；

  3.虚构事实、隐瞒真相以误导、欺骗他人的；

  4.侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；

  5.未经小羽+书面许可利用小羽+帐号和任何功能，以及第三方运营平台进行推广或互相推广的；

  6.利用小羽+帐号或本软件及服务从事任何违法犯罪活动的；

  7.制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；

  8.其他违反法律法规规定、侵犯其他用户合法权益、干扰产品正常运营或小羽+未明示授权的行为。

8.4 对自己行为负责
你充分了解并同意，你必须为自己注册帐号下的一切行为负责，包括你所发表的任何内容以及由此产生的任何后果。你应对本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。小羽+无法且不会对因前述风险而导致的任何损失或损害承担责任。

8.5 违约处理
1.如果小羽+发现或收到他人举报或投诉用户违反本协议约定的，小羽+有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规帐号处以包括但不限于警告、限制或禁止使用部分或全部功能、帐号封禁直至注销的处罚，并公告处理结果。

2.你理解并同意，小羽+有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应独自承担由此而产生的一切法律责任。

3.你理解并同意，因你违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，你应当独立承担责任；小羽+因此遭受损失的，你也应当一并赔偿。

九、【知识产权声明】
本软件通讯协议部分版权归属其原开发商所有，应用版权归属其开发者所有，软件版权归属小羽+团队所有。如有侵权，请联系小羽+团队。

十、【终端安全责任】
10.1 你理解并同意，本软件同大多数互联网软件一样，可能会受多种因素影响，包括但不限于用户原因、网络服务质量、社会环境等；也可能会受各种安全问题的侵扰，包括但不限于他人非法利用用户资料，进行现实中的骚扰；用户下载安装的其他软件或访问的其他网站中可能含有病毒、木马程序或其他恶意程序，威胁你的终端设备信息和数据安全，继而影响本软件的正常使用等。因此，你应加强信息安全及个人信息的保护意识，注意密码保护，以免遭受损失。
10.2 你不得制作、发布、使用、传播用于窃取小羽+帐号及他人个人信息、财产的恶意程序。
10.3 维护软件安全与正常使用是小羽+和你的共同责任，小羽+将按照行业标准合理审慎地采取必要技术措施保护你的终端设备信息和数据安全，但是你承认和同意小羽+并不能就此提供完全保证。
10.4 在任何情况下，你不应轻信借款、索要密码、软件开发定制或其他涉及财产的网络信息。涉及财产操作的，请一定先核实对方是否可信，并请经常留意有关防范诈骗犯罪的提示。
十一、【其他】
11.1 你使用本软件即视为你已阅读并同意受本协议的约束。 小羽+有权在必要时修改本协议条款。当本政策发生变更时，小羽+会更新本页面的内容，并更新下方的修订日期。本协议条款变更后，如果你继续使用服务，即视为你已接受修改后的协议。如果你不接受修改后的协议，应当停止使用服务。
11.2 本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。
11.3 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。
11.4 如您对本协议或其他相关事宜有疑问，请发邮件到zfy@ffstu.cn与我们联系。
    `
}
