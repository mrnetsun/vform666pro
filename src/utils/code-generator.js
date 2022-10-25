export const generateCode = function(formJson, codeType= 'vue') {
  let formJsonStr = JSON.stringify(formJson)

  if (codeType === 'html') {
    return `  
  <div id="app">
    <div class="row">
    <div class="col-md-9">
        <div class="main-form">
            <div class="form-body">

            <v-form-render :form-json="formJson" :form-data="formData" action="{{$form_action}}" method="post" id="{{$form_id}}"  accept-charset="UTF-8" class="{{$form_class}}" :option-data="optionData" ref="vFormRef">
    </v-form-render>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
    <div class="col-md-3 right-sidebar">
        <el-button type="primary" @click="submitForm">{{trans('core/base::forms.save')}}</el-button>
  </div>
</div> 
</div> 
<script>
  const { createApp } = Vue;
	const app = createApp({
      data() {
        return {
          formJson: ${formJsonStr},
          formData: {!! json_encode($formData) !!},
          optionData: {}
        }
      },
      methods: {
        submitForm() {
          this.$refs.vFormRef.getFormData().then( (formData) => {
            // Form Validation OK
            alert( JSON.stringify(formData) )
          }).catch( function(error) {
            // Form Validation Failed
            alert(error)
          })
        }
      }
	});
	app.use(ElementPlus)
	app.use(VFormRender)
	app.mount("#app");
</script>`

  } else {
    return `<template>
  <div>
    <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
    </v-form-render>
    <el-button type="primary" @click="submitForm">Submit</el-button>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'

  const formJson = reactive(${formJsonStr})
  const formData = reactive({})
  const optionData = reactive({})
  const vFormRef = ref(null)

  const submitForm = () => {
    vFormRef.value.getFormData().then(formData => {
      // Form Validation OK
      alert( JSON.stringify(formData) )
    }).catch(error => {
      // Form Validation failed
      ElMessage.error(error)
    })
  }
</script>`

  }
}
