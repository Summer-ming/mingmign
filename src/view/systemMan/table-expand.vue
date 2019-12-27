<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <!-- <i-col span="8">
                <span class="expand-key">Job: </span>
                <span class="expand-value">{{ row.job }}</span>
            </i-col>
            <i-col span="8">
                <span class="expand-key">Interest: </span>
                <span class="expand-value">{{ row.interest }}</span>
            </i-col>
            <i-col span="8">
                <span class="expand-key">Birthday: </span>
                <span class="expand-value">{{ row.birthday }}</span>
            </i-col>
        </Row>
        <Row>
            <i-col span="8">
                <span class="expand-key">Favorite book: </span>
                <span class="expand-value">《{{ row.book }}》</span>
            </i-col>
            <i-col span="8">
                <span class="expand-key">Favorite movie: </span>
                <span class="expand-value">{{ row.movie }}</span>
            </i-col>
            <i-col span="8">
                <span class="expand-key">Favorite music: </span>
                <span class="expand-value">{{ row.music }}</span>
            </i-col> -->
              <Table :columns="columns10" :data="data1"></Table>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        data(){
            return{ data1:[
                {
                       job: 'Data engineer',
                        interest: 'badminton',
                        birthday: '1991-05-14',
                },
                {
                       job: 'Data engineer',
                        interest: 'badminton',
                        birthday: '1991-05-14',
                },

            ],
                   columns10: [
                      {
                           type: 'selection'
                           
                      },
                    {
                        title: '工作',
                        key: 'job'
                    },
                    {
                        title: '兴趣',
                        key: 'interest'
                    },
                    {
                        title: '生日',
                        key: 'birthday'
                    }
                ],
            }
        },
        mounted(){
           console.log(this.row)
           
    },
    created(){
    
    }
    };
</script>
