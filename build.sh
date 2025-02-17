#!/bin/bash

# 设置代理
export http_proxy="http://127.0.0.1:7890"
export https_proxy="http://127.0.0.1:7890"

# 设置国内镜像源（如果代理不可用时的备选方案）
export NPM_CONFIG_REGISTRY="https://registry.npmmirror.com"

# 颜色输出函数
print_green() {
    echo -e "\033[32m$1\033[0m"
}

print_red() {
    echo -e "\033[31m$1\033[0m"
}

# 检查代理是否可用
check_proxy() {
    print_green "检查代理连接..."
    if curl -s --connect-timeout 2 "https://www.google.com" > /dev/null; then
        print_green "代理连接正常"
        return 0
    else
        print_red "代理连接失败，将使用国内镜像源"
        unset http_proxy
        unset https_proxy
        return 1
    fi
}

# 检查 Node.js 版本
check_node_version() {
    print_green "检查 Node.js 版本..."
    local required_version="20.0.0"
    local current_version=$(node -v | cut -d'v' -f2)
    
    if [ "$(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1)" = "$required_version" ]; then
        print_green "Node.js 版本符合要求"
        return 0
    else
        print_red "Node.js 版本过低，需要 v20.0.0 或更高版本"
        print_green "正在安装新版本 Node.js..."
        
        # 安装 nvm
        if ! command -v nvm &> /dev/null; then
            print_green "安装 nvm..."
            if [ $USE_PROXY -eq 1 ]; then
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            else
                curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
            fi
            
            # 加载 nvm
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        fi
        
        # 安装并使用 Node.js LTS 版本
        nvm install --lts
        nvm use --lts
        
        return 1
    fi
}

# 检查必要工具
check_requirements() {
    print_green "检查构建环境..."
    command -v node >/dev/null 2>&1 || { print_red "需要安装 Node.js，请先安装"; exit 1; }
    
    # 检查并更新 Node.js 版本
    check_node_version
    
    # 检查是否安装了 cnpm，如果没有则安装
    if ! command -v cnpm &> /dev/null; then
        print_green "安装 cnpm..."
        npm install -g cnpm --registry=https://registry.npmmirror.com
    fi
}

# 构建项目
build_project() {
    print_green "开始构建项目..."
    
    # 使用 cnpm 安装依赖
    print_green "使用 cnpm 安装依赖..."
    cnpm install
    
    # 执行构建
    npm run build
    
    if [ $? -ne 0 ]; then
        print_red "项目构建失败"
        exit 1
    fi
}

# 主函数
main() {
    print_green "开始一键构建项目..."
    
    # 检查代理
    check_proxy
    USE_PROXY=$?
    
    check_requirements
    build_project
    
    print_green "项目构建完成！"
}

# 如果没有 Node.js，安装 Node.js
if ! command -v node &> /dev/null; then
    print_green "正在安装 Node.js..."
    if [ $USE_PROXY -eq 1 ]; then
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    else
        # 使用国内镜像源安装 Node.js
        curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/setup_lts.x | sudo -E bash -
    fi
    sudo apt-get install -y nodejs
fi

main 