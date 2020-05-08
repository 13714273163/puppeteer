const nodeExcel = require('excel-export');
const fs = require('fs');
let data = [
    { name: "张三", age: "20", sex: "男", birthday: "1998-10-10" },
    { name: "李四", age: "21", sex: "男", birthday: "1997-08-08" },
    { name: "王五", age: "22", sex: "男", birthday: "1996-06-06" },
    { name: "赵六", age: "20", sex: "男", birthday: "1998-12-12" },
];

const conf = {};
// 定义sheet名称
conf.name = "Data";
// 定义列的名称以及数据类型
conf.cols = [{
    caption: 'Name',
    type: 'string'
}, {
    caption: 'age',
    type: 'string'
}, {
    caption: 'sex',
    type: 'string'
}];

// 定义row的数据
// conf.rows = [['guowf', "18"], ['Tom', "19"]];
let arr = []
data.forEach(item => {
    arr.push([item.name, item.age, item.sex, item.birthday])
})
conf.rows = arr
// execute方法生成文件源数据
const result = nodeExcel.execute(conf);
// fs将文件写到内存
fs.writeFile(`/test.xlsx`, result, 'binary', (err) => {
    err ? console.log(err) : null;
});