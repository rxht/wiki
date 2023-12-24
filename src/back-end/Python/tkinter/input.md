---
prev:
  text: '返回Python手册'
  link: '../'
---

# tkinter实现先弹出选择框后弹出输入框，并得到输入框的值

> [CSDN博客](https://blog.csdn.net/a1_a1_a/article/details/80007537?spm=1001.2014.3001.5502)

Python 自带的GUI tkinter实现界面编写有点难，这次我遇到的问题如下所示：
当我一开始进入系统时弹出如下选择框，我点击确定即可弹出输入框，可当我输入好相应信息之后点击确定，却拿不到我在输入框输入的值。
这个情况的具体代码如下：
```python
import tkinter as tk
from  tkinter import messagebox

def on_click():
    global UserName
    UserName = xls_text.get().lstrip()
    if len(UserName) == 0:
        print("用户名必须输入!")
        exit()
    root.quit()
    root.destroy()
    print("用户名：%s" %(UserName))

var_box = tk.messagebox.askyesno(title='系统提示',message='是否需要')#返回'True','False'
if var_box:
    root = tk.Tk()
    root.title("拍照")
    xls_text = tk.StringVar()
    l1 = tk.Label(root, text="请输入用户名：")
    l1.pack()  # 这里的side可以赋值为LEFT  RTGHT TOP  BOTTOM
    xls = tk.Entry(root, textvariable=xls_text)
    xls_text.set(" ")
    xls.pack()
    tk.Button(root, text="点击确认", command=on_click).pack()
    root.mainloop()
else:
    print("不做处理")
```

后来参考了罗兵的博客：http://www.jb51.net/article/119817.htm

将我的代码修改为如下：
```python
import tkinter as tk
from tkinter import messagebox

UserName = ""

class MyCollectApp(tk.Toplevel):#重点
    def __init__(self):
        super().__init__() #重点
        self.title('用户信息')
        self.setupUI()

    def setupUI(self):
        row1 = tk.Frame(self)
        row1.pack(fill="x")
        l1 = tk.Label(row1, text="用户名：",height=2,width=10)
        l1.pack(side=tk.LEFT)  # 这里的side可以赋值为LEFT  RTGHT TOP  BOTTOM
        self.xls_text = tk.StringVar()
        tk.Entry(row1, textvariable=self.xls_text).pack(side=tk.RIGHT)

        row2 = tk.Frame(self)
        row2.pack(fill="x")
        tk.Button(row2, text="点击确认", command=self.on_click).pack(side=tk.RIGHT)

    def on_click(self):
        #print(self.xls_text.get().lstrip())
        global UserName
        UserName = self.xls_text.get().lstrip()
        if len(UserName) == 0:
            #print("用户名必须输入!")
            messagebox.showwarning(title='系统提示',message='请输入用户名!')
            return False
        self.quit()
        self.destroy()
        print("用户名：%s" % (UserName))

if __name__ == '__main__':
    var_box = tk.messagebox.askyesno(title='系统提示', message='是否采集人脸数据需要')  # 返回'True','False'
    if var_box:
        app = MyCollectApp()
        app.mainloop()
    else:
        print('不做处理')
```
就像这样做了修改，这样就解决获取不到输入框的值得问题！
