#!/bin/bash

# 设置国内镜像源
export NPM_CONFIG_REGISTRY="https://registry.npmmirror.com"

# 颜色输出函数
print_green() {
    echo -e "\033[32m$1\033[0m"
}

print_red() {
    echo -e "\033[31m$1\033[0m"
}

# 检查必要工具
check_requirements() {
    print_green "检查构建环境..."
    command -v node >/dev/null 2>&1 || { print_red "需要安装 Node.js，请先安装"; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_red "需要安装 npm，请先安装"; exit 1; }
}

# 构建项目
build_project() {
    print_green "开始构建项目..."
    
    # 安装依赖
    npm install

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
    
    check_requirements
    build_project
    
    print_green "项目构建完成！"
}

# 如果没有 Node.js，安装 Node.js
if ! command -v node &> /dev/null; then
    print_green "正在安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

main 