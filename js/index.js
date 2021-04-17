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
        return function() {
            req({url: 'https://api.iyk0.com/qqdh?qq='+this.qq});
        };
    }
}

function newP(qq, describe) {
    return new Promise((resolve, reject) => {
        req({url: 'https://api.iyk0.com/qname/?qq='+qq, dataType:'text'})
            .then(res => {
                console.log("nickName", res);
                resolve(new TeamMember(qq, res, describe));
            }).catch(e => {
                reject(e);
            });
    });
}

$(document).ready(function(){

    // 加载历史版本
    req({url: 'https://api.github.com/repos/teammar/Lyp_product/releases'})
    .then(res => {
        if (res && res.length > 0) { 
            let $sevice = $('.services-section .wrapper .services-list').empty();
            res.forEach(item => {
                $sevice.append(`<li>
                    <div class="image-container">
                        <img src="${item.author.avatar_url}" alt="${item.name}">
                    </div>
                    <h5>${item.name}</h5>
                    <p style="text-align:left;" title="${item.body}">${item.body.substr(0, 100).replace(/\n/g, '<br>')+'...'}</p>
                    <a href="${item.zipball_url}">下载</a>
                    </li>`);
            });
            $sevice.append('<div class="clear"></div>');
            $('#top #navigation .nav-cta').prop('href', res[0].zipball_url);
            $('#banner .wrapper .buttons .button-1').prop('href', res[0].zipball_url);
        }
    }).catch(e => {
        alert(e);
    })


    // 加载团队
    Promise.all([
        newP('929461848', '框架设计、开发'),
        newP('2639068583', '易语言相关技术支持'),
        newP('2822569653', '提供配套接口'),
        newP('1872605420', '应用中心的UI开发'),
        newP('1723260175', '小羽客服'),
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

    req({
        url: 'https://api.github.com/repos/teammar/Lyp_product/issues/1/comments',
        type: 'POST',
        data: {
            owner: 'teammar',
            repo: 'Lyp_product',
            issue_number: 1,
            body: '这是接口测试提交'
        }
    },{
        Accept: 'application/vnd.github.v3+json' 
    })
});