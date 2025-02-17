#!/bin/bash

# 颜色输出函数
print_green() {
    echo -e "\033[32m$1\033[0m"
}

print_red() {
    echo -e "\033[31m$1\033[0m"
}

# 检查 Obsidian 配置目录
check_obsidian_dir() {
    # Obsidian 插件目录
    PLUGINS_DIR="/home/stories/my_stories/stories/.obsidian/plugins"
    
    if [ ! -d "$PLUGINS_DIR" ]; then
        print_red "未找到 Obsidian 插件目录，请确保已安装 Obsidian"
        print_red "默认路径: $PLUGINS_DIR"
        read -p "请输入自定义的 Obsidian 插件目录路径（直接回车使用默认路径）: " custom_dir
        if [ ! -z "$custom_dir" ]; then
            PLUGINS_DIR="$custom_dir"
        else
            mkdir -p "$PLUGINS_DIR"
        fi
    fi
}

# 安装插件
install_plugin() {
    print_green "开始安装插件..."
    
    # 创建插件目录
    PLUGIN_DIR="$PLUGINS_DIR/obsidian-export-image"
    mkdir -p "$PLUGIN_DIR"
    
    # 复制必要文件
    cp main.js manifest.json styles.css "$PLUGIN_DIR/"
    
    if [ $? -eq 0 ]; then
        print_green "插件安装成功！"
        print_green "插件位置: $PLUGIN_DIR"
        print_green "请重启 Obsidian 并在设置中启用插件"
    else
        print_red "插件安装失败"
        exit 1
    fi
}

# 主函数
main() {
    print_green "开始安装 Obsidian Export Image 插件..."
    
    # 检查编译后的文件是否存在
    if [ ! -f "main.js" ] || [ ! -f "manifest.json" ]; then
        print_red "未找到编译后的文件，请先运行构建脚本"
        exit 1
    fi
    
    check_obsidian_dir
    install_plugin
}

main 