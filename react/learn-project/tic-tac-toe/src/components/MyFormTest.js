import React, { Component } from 'react'

// 创建一个form表单的高阶组件，类似于antd中的Form.create，接受一个Form组件
// 包装用户的表单，增强数据管理能力和表单校验等功能，
// 高阶组件会提供方法给formItem使用，像表单校验、输入框事件等。需要接受来自formItem的参数。
function MyFormCreate(Comp) {

    return class extends Component {
        constructor(props) {
            super(props);
    
            // 存储各个表单项的配置项
            this.options = {};
            // state数据
            this.state = {};
        }

        // 处理输入框的change事件
        handleChange = event => {
            // 设置新的value值
            const {name, value} = event.target;
            this.setState({
                [name]: value
            }, () => {
                // 数据修改后的回调
                // 马上校验表单正确性
                this.validateField(name);
            });
        }

        // 校验某一个表单项
        validateField = field => {
            console.log('validateForm', field);
            // 获取rule
            const {rules} = this.options[field];

            // 如果存在未填项，则返回true
            let ret = rules.some(item => {
                // 只检查 必填项
                if (item.require) {
                    if (!this.state[field]) {
                        // 设置错误信息
                        this.setState({
                            [field + 'Message']: item.message
                        });

                        return true;
                    }
                }

                return false;
            });

            if (!ret) {
                // 校验成功
                this.setState({
                    [field + 'Message']: ''
                });
            }

            return !ret; // 纠正逻辑
        }

        // 校验整个表单
        validateForm = cb => {
            // 单独检验每一个表单项，返回一个boolean数组
            const results = Object.keys(this.options).map(field => this.validateField(field) === true);

            // 回调
            cb(results);
        }
    
        /**
         * 提供给表单使用的装饰器，高阶组件，输入一个 表单控件
         * 参数：表单name，配置项（表单校验等信息），具体的 表单控件
         */
        getFieldDecorator = (fieldName, option, inputComp) => {
            this.options[fieldName] = option; // 将配置添加到this.options中

            // 返回一个功能加强的组件
            return (
                <div>
                    {/* 克隆react元素，see：https://zh-hans.reactjs.org/docs/react-api.html#cloneelement */}
                    {
                        React.cloneElement(
                            inputComp,
                            {
                                name: fieldName, 
                                value: this.state[fieldName] || '', // 输入框的值
                                onChange: this.handleChange, // 在inputComp中绑定change事件
                            }
                        )
                    }
                    {/* 显示校验信息 */}
                    {
                        this.state[fieldName + 'Message'] && <p style={{color: 'red'}}>{this.state[fieldName + 'Message']}</p>
                    }
                </div>
            )
        }
    
        render() {
            return (
                /* 拓展了getFieldDecorator方法 、validateForm方法 */
                <Comp {...this.props} getFieldDecorator={this.getFieldDecorator} value={this.state} validateForm={this.validateForm}/>
            )
        }
    }
}

// FormItem组件
class FormItem extends Component {
    render() {
        return (
            <p>kdkdk</p>
        );
    }
}

// 使用ES7的装饰器语法使用MyFormCreate高阶组件，MyFormCreate(MyFormTest)
@MyFormCreate
class MyFormTest extends Component {

    handleSubmit = () => {
        console.log('submitValue', this.props.value);

        this.props.validateForm((valids) => {
            if (valids.every(isValid => isValid === true)) {
                alert('校验成功!');
            } else {
                alert('校验失败!');                
            }
        });
    }

    render() {

        const {getFieldDecorator} = this.props;

        return (
            <div>
                {/* <input type="text" /> */}
                {
                    getFieldDecorator(
                        'username', 
                        {
                            rules: [{require: true, message: '请输入用户名！'}]
                        }, 
                        <input type="text" />
                    )
                }

                {
                    getFieldDecorator(
                        'password', 
                        {
                            rules: [{require: true, message: '请输入密码！'}]
                        }, 
                        <input type="password" />
                    )
                }
                
                <button onClick={this.handleSubmit}>OK</button>
            </div>
        )
    }
}

export default MyFormTest;
