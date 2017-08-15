<template>
    <div class="app">
        <div class="header">
            <div class="header-container">
                <span style="font-size:25px;">前端ML</span>
            </div>
        </div>
        <div class="container">
            <div class="content" v-loading="loading">
                <div class="item" v-for="(e, index) in content_data" :key="index">
                    <el-card :body-style="{ padding: '0px' }">
                        <div class="card-des">
                            <div class="des-img">
                                <img class="image" :src="e.src">
                            </div>
                            <div class="des-detail">
                                <div class="detail-content">
                                    <span style="font-size:20px;font-weight:bold;margin-bottom:10px">{{e.name}}</span>
                                    <div class="detail-item" v-for="(key, index) in Object.keys(e)" :key="index" v-if=" key!=='src' &&  key!=='id'&&  key!=='name'">
                                        <span class="detail-item-title">{{key+'：'}}</span>
                                        {{e[key]}}
                                    </div>
                                </div>
                                <div class="card-container">
                                    <div class="card-bottom clearfix">
                                        <el-button icon="star-off" :type="getStyle(e.id)" @click="want(e.id)">想看</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="next_step===0?next():complete()"> {{next_step===0?'下一步':'提交'}} </el-button>
        </div>
    </div>
</template>

<script>
    import { book_data, movie_data } from './data';
    import { Neuron, Layer, Network, Trainer, Architect } from 'synaptic'
    export default {
        data() {
            return {
                loading: false,
                content_data: [],
                book_ids: [],
                movie_ids: [],
                next_step: 0,
            }
        },
        created() {
            this.content_data = this.shuffle(book_data);
            const myNetwork = new Architect.Perceptron(2, 2, 1);
            const trainer = new Trainer(myNetwork);
            // trainer.XOR();
            // trainer.activate([0, 0]); // 0.0268581547421616
            // trainer.activate([1, 0]); // 0.9829673642853368
            // trainer.activate([0, 1]); // 0.9831714267395621
            // trainer.activate([1, 1]); // 0.02128894618097928
            const trainingSet = [
                {
                    input: [0, 0],
                    output: [0]
                },
                {
                    input: [0, 1],
                    output: [1]
                },
                {
                    input: [1, 0],
                    output: [1]
                },
                {
                    input: [1, 1],
                    output: [0]
                },
            ];
            trainer.trainAsync(trainingSet, {
                rate: 0,
                iterations: 500000,
                error: .005,
                shuffle: false,
                log: 10000,
                cost: Trainer.cost.CROSS_ENTROPY
            }).then(results => {
                console.log('done!', results)
            });


        },
        methods: {
            shuffle(input) {
                for (let i = input.length - 1; i >= 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const k = input[j];
                    input[j] = input[i];
                    input[i] = k;
                }
                return input;
            },
            next() {
                const res_ids = new Array(20).fill(0);
                this.book_ids.forEach(e => {
                    res_ids[e] = 1;
                });
                this.content_data = this.shuffle(movie_data);
                this.next_step = 1;
                console.log(res_ids);
            },
            want(id) {
                switch (this.next_step) {
                    case 0:
                        if (this.book_ids.indexOf(id) === -1) {
                            this.book_ids.push(id);
                        } else {
                            this.book_ids.splice(this.book_ids.indexOf(id), 1);
                        }
                        break;
                    case 1:
                        if (this.movie_ids.indexOf(id) === -1) {
                            this.movie_ids.push(id);
                        } else {
                            this.movie_ids.splice(this.movie_ids.indexOf(id), 1);
                        }
                        break;
                }
            },
            complete() {
                const res_ids = new Array(20).fill(0);
                this.movie_ids.forEach(e => {
                    res_ids[e] = 1;
                });
                console.log(res_ids);
            },
            getStyle(id) {
                switch (this.next_step) {
                    case 0:
                        return this.book_ids.indexOf(id) === -1 ? 'default' : 'primary';
                    case 1:
                        return this.movie_ids.indexOf(id) === -1 ? 'default' : 'primary';
                }
            }
        }
    }
</script>

<style scoped>
    .app {
        display: flex;
        flex-direction: column;
    }

    .header {
        height: 40px;
        display: flex;
        justify-content: center;
        width: 100%;
        position: fixed;
        background: #fff;
        padding: 10px 0px;
        border-bottom: 1px solid #eee;
    }

    .header-container {
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .container {
        margin-top: 75px;
        display: flex;
        justify-content: center;
    }

    .content {
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .item {
        padding-bottom: 10px;
    }

    .card-des {
        display: flex;
        width: 370px;
    }

    .des-img {
        padding: 5px;
    }

    .image {
        height: 266px;
        width: 190px;
        display: block;
    }

    .des-detail {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 5px 5px;
        justify-content: space-between;
    }

    .detail-content {
        display: flex;
        flex-direction: column;
    }

    .detail-item {
        color: #111;
        font-size: 14px;
        margin: 2px 0px;
    }

    .detail-item-title {
        color: #666;
    }

    span {
        white-space: normal;
    }

    .card-container {
        border-top: 1px solid #d1dbe5;
    }

    .card-bottom {
        margin: 10px 5px 5px 5px;
        text-align: center;
    }



    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .footer {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        padding: 20px;
        border-top: 1px solid #eee;
    }
</style>
