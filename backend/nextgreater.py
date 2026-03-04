arr=[10,20,30,40,50]
k=1
if len(arr)<k:
    k=k%len(arr)
    j=0
    for i in range(k,len(arr)):
        arr[j],arr[i]=arr[i],arr[j]
        j+=1
elif len(arr)>k:
    j=0
    for i in range(k,len(arr)):
        arr[j],arr[i]=arr[i],arr[j]
        j+=1
print(arr)        


