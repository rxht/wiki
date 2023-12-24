---
prev:
  text: '返回Python手册'
  link: '../'
---

# 香农编码
> [CSDN博客](https://blog.csdn.net/a1_a1_a/article/details/81484328?spm=1001.2014.3001.5502)

文件：香农编码.m
```matlab
%界面输入的信源分布[0.01,0.02,0.07,0.04,0.06,0.8] [0.2,0.18,0.17,0.15,0.19,0.1,0.01]
clc;
state = 1;%状态码，用于判断用户所输入的信源概率是否符合要求
while state; %如果不符合要求一直做循环
    pa=input('请输入信源分布:');
    if min(pa)<0||max(pa)>1    %判断信源概率值是否介于0到1之间
        clc;
        disp('概率值必须介于0到1之间，请重新输入信源分布');
    elseif sum(pa)~=1     %判断信源累加和是否为1
        clc;
        disp(['您目前的概率累加和为：',num2str(sum(pa)),'      注意：概率累加和必须等于1，请重新输入信源分布'])
    else
        k=length(pa);       %计算信源符号个数
        disp(['信源符号个数为：',num2str(k)])
        pa=sort(pa,'descend');
        state = 0;
        %for i=1:k-1      %for循环进行降序排列
            %for n=i+1:k
                %if (pa(i)<pa(n))
                    %t=pa(i);
                    %pa(i)=pa(n);
                    %pa(n)=t;    
                %end
            %end
        %end
    end
end
disp(['信源分布概率从大到小为：',num2str(pa)])

y=0;%给y赋初值，用来求概率和
f=0;%给f赋初值，用来得到子程序最大循环次数
s=zeros(k,1);   %对求和结果进行矩阵初始化
b=zeros(k,1);   %对编码位数矩阵初始化
w=zeros(k,1);  %对二进制矩阵初始化
disp('初始概率     求和结果    编码位数    最终编码')
for m=1:k;       %进行香农编码
    s(m)=y;
    y=y+pa(m);
    b(m)=ceil(-log2(pa(m)));%求得的自信息量向上取整，得到码字长度
    z=zeros(b(m),1);    %对码字矩阵初始化
    f=max(b(m));   %把码字最大长度赋给f，用于进行十进制转二进制
    w=dtob(s(m),f);    %调用子程序将十进制转换为二进制
    for r=1:b(m)
        z(r)=w(r);
    end
   disp([' ',num2str(pa(m)),'          ',num2str(s(m)),'         ',num2str(b(m)),'         ',num2str(z')])
end


L=0;
H=0;
for i=1:k       %使用for循环进行信息熵、平均码长求解
    a(i)=-log2(pa(i));  %a(i)表示单个信源的自信息量
    K(i)=ceil(a(i));   %K(i)表示对自信息量向上取整
    R(i)=pa(i)*K(i);
    L=L+R(i);  %求平均码长
    c(i)=a(i)*pa(i);
    H=H+c(i);  %信息熵
end
Y=H/L;   %用Y来表示编码效率
disp(['信息熵H(X)=',num2str(H),'(bit/sign)']); 
disp(['平均码长K=',num2str(L),'(bit/sign)']);

disp(['编码效率=',num2str(Y)]);  
```

文件：dtob.m
```matlab
function y=dtob(x,f)
for i=1:f
    temp=x.*2;
    if(temp<1)
        y(i)=0;
        x=temp;
    else
        x=temp-1;
        y(i)=1;
    end
end
```
