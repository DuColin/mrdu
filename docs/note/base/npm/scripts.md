# scripts







启动脚本运⾏前会先⾃动新建⼀个命令⾏环境，然后 把当前⽬录下的node_modules/.bin加⼊系统环境变量中，接着执⾏ `scripts`配置节指定的脚本的内容，执⾏完成后再把node_modules/.bin从 系统环境变量中删除。所以，当前⽬录下的node_modules/.bin⼦⽬录 ⾥⾯的所有脚本，都可以直接⽤脚本名调⽤，不必加上路径

https://ajmalsiddiqui.me/blog/introduction-to-npm-scripts/

https://www.ruanyifeng.com/blog/2016/10/npm_scripts.html
