<template>
  <div class="upload-container">
    <section class="btns">
      <div class="file-upload">
        <div class="file-upload-text">选择文件</div>
        <input ref="fileInput" class="file-upload-input" multiple type="file" @change="handleBeforeUpload">
      </div>
      <el-popover
        v-model="visible"
        placement="top"
        width="160"
        style="margin-right: 10px"
      >
        <p>确定清空所有文件？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="deleteAll">确定</el-button>
        </div>
        <el-button slot="reference">清空文件</el-button>
      </el-popover>
      <el-button type="danger" @click="startUpload">开始上传</el-button>
    </section>
    <section class="content">
      <i-table border :columns="columns" :data="fileList">
        <template slot-scope="{ row }" slot="status">
          <i class="el-icon" :class="getStateIcon(row)" />
        </template>
        <template slot-scope="{ row }" slot="name">
          <el-input v-model="row.fileName" placeholder="不能为空" />
        </template>
        <template slot-scope="{ row }" slot="progress">
          <el-progress v-if="!row.message" :percentage="row.process" :status="processStatus(row)" />
          <span v-else style="color: #F56C6C">{{ row.message }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <el-button
              v-show="row.state !== 2"
              type="text"
              size="small"
              @click.native.prevent="deleteRow(index)"
            >
              移除
            </el-button>
        </template>
      </i-table>
      <!-- <el-table
        :data="fileList"
        fit
        border
      >
        <el-table-column
          label="状态"
          width="50"
        >
          <template slot-scope="scope">
            <i :class="getStateIcon(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          label="文件名称"
          width="300"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.fileName" placeholder="不能为空" />
          </template>
        </el-table-column>
        <el-table-column
          label="原文件名称"
          width="300"
          prop="originFileName"
        ></el-table-column>
        <el-table-column
          prop="filepath"
          label="文件路径"
        ></el-table-column>
        <el-table-column
          label="上传进度"
        >
          <template slot-scope="scope">
            <el-progress v-if="!scope.row.message" :percentage="scope.row.process" :status="processStatus(scope.row)" />
            <span v-else style="color: #F56C6C">{{ scope.row.message }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.state !== 2"
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import SparkMD5 from 'spark-md5'
const api = require('./baseApi.json')
import { getSignature, saveResourceInfo, preCheck } from './api'
export default {
  name: 'CrystalUpload',
  props: {
    mode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      columns: [
        {
          title: '状态',
          width: 67,
          slot: 'status'
        },
        {
          title: '文件名称',
          width: 300,
          slot: 'name'
        },
        {
          title: '原文件名称',
          width: 300,
          key: 'originFileName'
        },
        {
          title: '文件路径',
          key: 'filepath'
        },
        {
          title: '上传进度',
          slot: 'progress'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      fileList: [],
      visible: false,
      fileIndex: 0,
      signatureData: null,
      fileTypes: ['.kfb', '.mdsx', '.sdpc']
    }
  },
  computed: {
    apiObject() {
      return api[this.mode]
    }
  },
  mounted() {
    
  },
  methods: {
    handleBeforeUpload(event) {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const singleFile = {
          file: file,
          fileName: file.name,
          originFileName: file.name,
          size: file.size,
          process: 0,
          state: 0
        }
        this.fileList.push(singleFile)
        console.log(this.fileList)
      }
      this.$nextTick(_ => {
        this.$refs.fileInput.value = null
      })
    },
    getStateIcon(row) {
      if (row.state === 0) {
        return 'el-icon-upload'
      } else if (row.state === 1) {
        return 'el-icon-loading'
      } else if (row.state === 2) {
        return 'el-icon-success'
      } else if (row.state === 3) {
        return 'el-icon-error'
      }
      return ''
    },
    getMD5(file) {
      const reader = new FileReader()
      reader.readAsBinaryString(file)
      return new Promise((resolve, reject) => {
        reader.onload = e => {
          const md5 = SparkMD5.hashBinary(e.target.result)
          resolve(md5)
        }
      })
    },
    getSignatureAndUpload(file, key, callback) {
      getSignature(this.apiObject.baseUrl + this.apiObject.signatureUrl).then(res => {
        this.signatureData = res.data
        this.upload(file, key, m => {
          callback(m)
        })
      })
    },
    startUpload() {
      if (this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (!this.fileList[i].fileName) {
            this.$message.error('文件名不能为空')
            return
          }
          if (this.fileTypes.indexOf(this.fileList[i].fileName.substring(this.fileList[i].fileName.lastIndexOf('.'))) < 0) {
            this.$message.error('只支持上传后缀为 .kfb / .mdsx / .sdpc 的切片文件')
            return
          }
        }
        if (this.fileIndex < this.fileList.length) {
          const file = this.fileList[this.fileIndex]
          console.log(this.fileIndex)
          console.log(file)
          this.getMD5(file.file).then(res => {
            if (!this.signatureData || this.signatureData.expire <= new Date().getTime()) {
              this.getSignature().then(m => {
                const data = {
                  fileName: file.fileName,
                  fileSize: file.size,
                  md5: res,
                  path: m.path
                }
                preCheck(this.apiObject.baseUrl + this.apiObject.prepUrl, data).then(res => {
                  const obj = JSON.parse(JSON.stringify(this.fileList[this.fileIndex]))
                  if (!res.data) {
                    obj.message = res.message
                    this.$set(this.fileList, this.fileIndex, obj)
                    this.fileIndex += 1
                    this.startUpload()
                  } else {
                    if (res.data.hasUpload) {
                      obj.message = '该切片已上传，请勿重复上传'
                      obj.filepath = res.data.slide.outerFilepath
                      this.$set(this.fileList, this.fileIndex, obj)
                      this.fileIndex += 1
                      this.startUpload()
                    } else {
                      file.globalId = res.data.slide.globalId
                      this.frontUpload(file, res.data.slide.objectKey, m => {
                        if (m === 100) {
                          this.fileIndex += 1
                          this.startUpload()
                        }
                      })
                    }
                  }
                })
              })
            } else {
              const data = {
                fileName: file.fileName,
                fileSize: file.size,
                md5: res,
                path: this.signatureData.path
              }
              preCheck(this.apiObject.baseUrl + this.apiObject.prepUrl, data).then(res => {
                const obj = JSON.parse(JSON.stringify(this.fileList[this.fileIndex]))
                if (!res.data) {
                  obj.message = res.message
                  this.$set(this.fileList, this.fileIndex, obj)
                  this.fileIndex += 1
                  this.startUpload()
                } else {
                  if (res.data.hasUpload) {
                    obj.message = '该切片已上传，请勿重复上传'
                    obj.filepath = res.data.slide.outerFilepath
                    this.$set(this.fileList, this.fileIndex, obj)
                    this.fileIndex += 1
                    this.startUpload()
                  } else {
                    file.globalId = res.data.slide.globalId
                    this.frontUpload(file, res.data.slide.objectKey, m => {
                      if (m === 100) {
                        this.fileIndex += 1
                        this.startUpload()
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    },
    async getSignature() {
      const res = await getSignature(this.apiObject.baseUrl + this.apiObject.signatureUrl)
      this.signatureData = res.data
      return res.data
    },
    frontUpload(file, key, callback) {
      if (file.state !== 0 && file.state !== 3) {
        return
      }
      this.upload(file, key, (res) => {
        callback(res)
      })
    },
    upload(file, key, callback) {
      const uploadParams = {
        'key': key,
        'policy': this.signatureData.policy,
        'OSSAccessKeyId': this.signatureData.accessId,
        'success_action_status': '200',
        // 'callback' : callbackbody,
        'signature': this.signatureData.signature,
        'name': file.originFileName,
        'file': file.file,
        'globalId': file.globalId,
        'url': this.signatureData.host
      }
      this.ossRequest(uploadParams, file, (res) => {
        callback(res)
      })
    },
    ossRequest(data, file, callback) {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('key', data.key)
      formData.append('policy', data.policy)
      formData.append('OSSAccessKeyId', data.OSSAccessKeyId)
      formData.append('success_action_status', data.success_action_status)
      formData.append('signature', data.signature)
      formData.append('file', data.file)
      axios({
        url: data.url,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // 上传进度
        onUploadProgress: (progressEvent) => {
          file.state = 1
          const num = progressEvent.loaded / progressEvent.total * 100 | 0
          if (num >= 99 && num <= 100) {
            file.process = 99
          } else {
            file.process = num
          }
        }
      }).then(res => {
        if (res.statusText === 'OK') {
          console.log('ok')
          const resourceInfo = {
            globalId: file.globalId,
            result: 1
          }
          saveResourceInfo(this.apiObject.baseUrl + this.apiObject.completeUrl, resourceInfo).then(() => {
            file.process = 100
            file.state = 2
            file.filepath = data.url + '/' + data.key + '/' + data.name
            callback(file.process)
          }).catch(() => {
            file.state = 3
          })
        } else {
          const resourceInfo = {
            globalId: file.globalId,
            result: 0
          }
          saveResourceInfo(this.apiObject.baseUrl + this.apiObject.completeUrl, resourceInfo).then(() => {
            file.state = 3
          })
        }
      }).catch(() => {
        const resourceInfo = {
          globalId: file.globalId,
          result: 0
        }
        saveResourceInfo(this.apiObject.baseUrl + this.apiObject.completeUrl, resourceInfo).then(() => {
          file.state = 3
        })
      })
    },
    processStatus(row) {
      if (row.state === 2) {
        return 'success'
      } else if (row.state === 3) {
        return 'exception'
      }
    },
    deleteRow(index) {
      this.fileList.splice(index, 1)
    },
    deleteAll() {
      this.fileList = []
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .btns{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .file-upload {
    background: #1890ff;
    color: #fff;
    width: 98px;
    height: 40px;
    position: relative;
    overflow: hidden;
    border: 1px solid #1890ff ;
    display: inline-block;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    margin-right: 10px;
  }
  .file-upload-input {
    background-color: transparent;
    position: absolute;
    width: 999px;
    height: 999px;
    top: -10px;
    right: -10px;
    cursor: pointer;
  }
  .el-icon-upload {
    color: #1890ff;
  }
  .el-icon-success {
    color: #67c23a;
  }
  .el-icon-error {
    color: #f56c6c;
  }
</style>