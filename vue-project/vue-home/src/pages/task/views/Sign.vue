<template>
    <section class="sign-page">
        <section class="sign-box">
            <div class="sign-top">
                <div class="sign-content" key="sign-succ">
                    <p class="sign-text">You've checked in successfully.</p>
                    <p class="sign-bonus">
                        +20 <span>Bonus</span>
                    </p>
                </div>
            </div>
        </section>
        <!--<section @click="showToast('123')">
            Sign Page djaskflj

            &lt;!&ndash;<mt-button type="default">default</mt-button>
            <mt-button type="primary">primary</mt-button>
            <mt-button type="danger">danger</mt-button>&ndash;&gt;
        </section>-->
    </section>
</template>

<script>
export default {
  name: 'sign',
  methods: {
    showToast (text) {
      alert(text)
    }
  }
}
</script>

<style lang="stylus">
    /*.sign-page {
        min-height: 100%;
        background-color: #f8e8ef;
        text-align: center;
    }

    .sign-box {
        padding: 0.2rem 0.3rem;
    }

    .sign-top {
        position: relative;
        padding-top: 0.22rem;
        height: 0.98rem;
        box-sizing: border-box;
        background: url(http://file.dreame.com/group1/M00/00/E4/rB84dlxzWbyAbFrlAAAbWeSNh1E581.png) no-repeat center;
        background-size: 100% 100%;
        overflow: hidden;

        &.sign-fail {
            padding-top: 0.13rem;
        }

        .sign-text {
            line-height: 0.28rem;
            font-size: 0.14rem;
            color: #222222;
        }

        .sign-bonus {
            height: 0.3rem;
            line-height: 0.3rem;
            font-size: 0.3rem;
            color: #FF53B0;

            > span {
                font-size: 0.16rem;
            }
        }

        .button {
            margin-top: 0.12rem;
            width: 1.08rem;
            background: #FF53B0;
        }
    }*/

    /****** px版本-start *******/
    .sign-page {
        min-height: 100%;
        background-color: #f8e8ef;
        text-align: center;
    }

    .sign-box {
        padding: 20px 30px;
    }

    .sign-top {
        position: relative;
        padding-top: 22px;
        height: 98px;
        box-sizing: border-box;
        background: url(http://file.dreame.com/group1/M00/00/E4/rB84dlxzWbyAbFrlAAAbWeSNh1E581.png) no-repeat center;
        background-size: 100% 100%;
        overflow: hidden;

        &.sign-fail {
            padding-top: 13px;
        }

        .sign-text {
            line-height: 28px;
            font-size: 14px;
            color: #222222;
        }

        .sign-bonus {
            height: 30px;
            line-height: 30px;
            font-size: 30px;
            color: #FF53B0;

            > span {
                font-size: 16px;
            }
        }

        .button {
            margin-top: 12px;
            width: 108px;
            background: #FF53B0;
        }
    }
    /****** px版本-end *******/

    /******* px2rem-start *******/
    /*px2rem(pxValue) {
        unit(pxValue / 100, rem);
    }
    .sign-page {
        min-height: 100%;
        background-color: #f8e8ef;
        text-align: center;
    }

    .sign-box {
        padding: px2rem(20) px2rem(30);
    }

    .sign-top {
        position: relative;
        padding-top: px2rem(22);
        height: px2rem(98);
        box-sizing: border-box;
        background: url(http://file.dreame.com/group1/M00/00/E4/rB84dlxzWbyAbFrlAAAbWeSNh1E581.png) no-repeat center;
        background-size: 100% 100%;
        overflow: hidden;

        &.sign-fail {
            padding-top: px2rem(13);
        }

        .sign-text {
            line-height: px2rem(28);
            font-size: px2rem(14);
            color: #222222;
        }

        .sign-bonus {
            height: px2rem(30);
            line-height: px2rem(30);
            font-size: px2rem(30);
            color: #FF53B0;

            > span {
                font-size: px2rem(16);
            }
        }

        .button {
            margin-top: px2rem(12);
            width: px2rem(108);
            background: #FF53B0;
        }
    }*/
    /******* px2rem-end *******/
</style>
