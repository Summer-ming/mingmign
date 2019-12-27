<template>
  <div>
  
      <row>
            <!-- 上传图片 -->
    <row style='margin-bottom:20px;'>
        <b class="font_32">图片信息</b> 
        <!-- <Tag type="border" color="error">第一张为营业执照</Tag>
        <Tag type="border" color="error">第二张为开票资料</Tag>        -->
        <br>
        <div  class="demo-upload-list" v-for="(item,index) in uploadList" :key='index' v-if="item">
            <template v-if="item.status === 'finished'">
                <img :src="item.url" v-if="item.url.indexOf('.pdf') ==-1" >
                <img src="https://jgys.oss-cn-shenzhen.aliyuncs.com/baseImg/pdf.jpg" v-else >
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
<template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
</div>
<Upload 
ref="upload" :show-upload-list="false" 
:default-file-list="defaultList" 
:on-success="handleSuccess" 
:format="['jpg','jepg','png','pdf']" :max-size="5120" ror="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload"
    multiple type="drag" :action="updateImgUrl" style="display:inline-block;width:58px">
    <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
    </div>
    <Modal   title="查看图片" v-model="visible">
        <img :src="this.$global.ossUrl + imgName" v-if="visible" style="width: 100%">
    </Modal>
</Upload>

    </row>
      </row>

      <!-- 提交修改 -->
      <row>
          <Button   type="primary" @click='getImg'>提交修改</Button>
      </row>


  </div>
</template>
<script>
import {updateOrderStatus} from '@/api/data_8889'
  export default {
    name: 'sell_img',
    props: ["allOrder_orderItem"],
    data(){
      return {
      updateImgUrl: this.$global.updateImgUrl, //上传图片
      visible: false,
      valueForm_allOrder_orderItem:'',
      defaultList: [],
      uploadList: [],
      imgString:"",//图片的参数
      }
    },
    methods:{

        //上传图片
         handleView(name) {
                        //判断如果是pdf 则打开新的窗口
                        if(name.indexOf('.pdf') == -1){
                        this.imgName = name;
                        this.visible = true;
                        }else{
                        window.open(this.$global.ossUrl+name);

                        }
                },
         handleRemove(file) {
                this.uploadList.splice(this.uploadList.indexOf(file), 1);
            },
         handleSuccess(res, file) {
                this.$Message.success('上传成功');
                console.log("上传成功");
                 console.log(this.uploadList)
                file.name = res.msg;
                file.url = this.$global.ossUrl + res.msg;
              
                this.uploadList.push(file);
        
                const reg=/,$/gi;//此处是正则
            },
         handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确 ',
                    desc: '文件 ' + file.name + '格式不正确，请选择 jpg 或者 png.'
                });
            },
         handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: '文件  ' + file.name + ' 太大，最大不超过20M'
                });
            },
         handleBeforeUpload() {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最大支持上传5张图片'
                    });
                }else{
                   
                }
                return check;
            },
            //修改照片提交
         getImg(){ 
            this.uploadList.map((item)=>{
                     this.imgString += item.url+','    
                })
            let params={
                pageUpdateOrderList:[{
                    id:this.valueForm_allOrder_orderItem.id,//订单id,
                    pictures:this.imgString
                }]
            };
            updateOrderStatus(params).then(res=>{
             if(res.code =="100"){
                this.$Message.success("修改成功")
          }  
         })
         },
            setImageInfo(){
                            Array.prototype.notempty = function() {
                        var arr = [];
                        this.map(function(val, index) {
                        //过滤规则为，不为空串、不为null、不为undefined
                        if (val !== "" && val != undefined) { arr.push(val); }});
                        return arr;
                    };
                    let pa=[];
                    if(this.valueForm_allOrder_orderItem.pictures.length>0){
                        let photo=this.valueForm_allOrder_orderItem.pictures.split(',');
                            let photM=photo.notempty();
                            
                            photM.map((item)=>{
                                let photoParm={};//存放数组的对象
                                console.log(item)
                                photoParm.url=item
                                let b=item.split('http://jgys.oss-cn-shenzhen.aliyuncs.com/')
                                photoParm.name=b[1]
                                photoParm.status='finished'
                                    pa.push(photoParm)
                            })
                            console.log(pa)
                            this.uploadList=pa
                    }else{

                    }
            }
       
    },
     watch: {
        allOrder_orderItem(val){
            this.valueForm_allOrder_orderItem = val;
            this.setImageInfo();
        }
        
    },
    mounted(){
     
    },
  }
</script>
<style <style lang="less">
.demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
        margin-top: 20px;
    }
    
    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }
    
    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }
    
    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }
    
    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

</style>

