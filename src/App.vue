<template>
    <div class="app">
        <div class="header">
            <div class="header-container">
                <span style="font-size:25px;">前端ML</span>
            </div>
        </div>
        <div class="container" v-loading.body="loading">
            <div class="content">
                <div class="item" v-for="(e, index) in content_data" :key="index">
                    <el-card :body-style="{ padding: '0px' }">
                        <div class="card-des">
                            <div class="des-img">
                                <img class="image" :src="e.src">
                            </div>
                            <div class="des-detail">
                                <div class="detail-content">
                                    <span style="font-size:20px;font-weight:bold;margin-bottom:10px">{{e.name}}</span>
                                    <div class="detail-item" v-for="(key, index) in Object.keys(e)" :key="index"
                                         v-if=" key!=='src' &&  key!=='id'&&  key!=='name'">
                                        <span class="detail-item-title">{{key + '：'}}</span>
                                        {{e[key]}}
                                    </div>
                                </div>
                                <div class="card-container">
                                    <div class="card-bottom clearfix">
                                        <el-button icon="star-off" :type="getStyle(e.id)" @click="want(e.id)">想看
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="next_step===0?next():complete()"> {{next_step === 0 ? '下一步' : '提交'}}
            </el-button>
        </div>
        <el-dialog title="神经网络预测结果" :visible.sync="resultDialogVisible">
            <p>您的选择：{{trainingSet.output}}</p>
            <p>我们的预测：{{activatedResult}}</p>
            <p>您的选择结果已经在前端对神经网络进行了训练！</p>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import { book_data, movie_data } from './data';
    import { Neuron, Layer, Network, Trainer, Architect } from 'synaptic';

    const learningRate = .3;
    let localNetworkInstance;

    export default {
        data() {
            return {
                loading: false,
                content_data: [],
                book_ids: [],
                movie_ids: [],
                next_step: 0,
                trainingSet: {
                    input: [],
                    output: [],
                },
                activatedResult: [],
                resultDialogVisible: false,
            }
        },
        created() {
            // fetch the train model from server
            this.content_data = this.shuffle(book_data);
            this.loading = true;
            axios.post('http://localhost:3000/getNetwork')
                .then((response) => {
                    console.log(response);
                    this.loading = false;
                    const networkJSON = response.data.network;
                    if (networkJSON && Object.keys(networkJSON).length > 0) {
                        this.$message('Received neural network from server.');
                        console.log('received network', networkJSON);
                        localNetworkInstance = Network.fromJSON(networkJSON);
//                        mock();
                    } else {
                        this.$message('Created a new network instance.');
                        console.log('create a new network instance');
                        // create a new network instance
                        const inputLayer = new Layer(20);
                        const hiddenLayer = new Layer(20);
                        const outputLayer = new Layer(20);

                        inputLayer.project(hiddenLayer);
                        hiddenLayer.project(outputLayer);

                        localNetworkInstance = new Network({
                            input: inputLayer,
                            hidden: [hiddenLayer],
                            output: outputLayer
                        });
                    }
                })
                .catch(function (error) {
                    this.loading = false;
                    console.log(error);
                });

            const mock = () => {
                // ======== mock =========
                // train the network
                console.log('mock');
                const learningRate = .3;
                for (let i = 0; i < 20000; i++) {
                    // 0,0 => 0
                    localNetworkInstance.activate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    localNetworkInstance.propagate(learningRate, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

                    // 0,1 => 1
                    localNetworkInstance.activate([1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    localNetworkInstance.propagate(learningRate, [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]);
                }

// test the network
                console.log(localNetworkInstance.activate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])); // [0.015020775950893527]
                console.log(localNetworkInstance.activate([1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])); // [0.015020775950893527]
            }
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
                this.$set(this.trainingSet, 'input', res_ids);
                console.log(res_ids);
                this.$message('Neural Network activated!');
                this.activatedResult = localNetworkInstance.activate(res_ids);
                this.activatedResult = this.activatedResult.map((num) => (num <= 0.5 ? 0 : 1));
                console.log('activated: ', this.activatedResult);
                this.next_step = 1;
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
                if (this.next_step === 1) {
                    this.$set(this.trainingSet, 'output', res_ids);
                    this.reTrainByThisUserData();
                    this.showResult();
                }
            },
            reTrainByThisUserData() {
                // retrain the model by this user's data
                if (localNetworkInstance) {
                    localNetworkInstance.propagate(learningRate, this.trainingSet.output);   // propagate the network
                    console.log('retrained: ', localNetworkInstance.toJSON());
                    console.log('sending to server');

                    this.$message('Neural Network retrained!');

                    const successFunc = () => {
                        console.log('success');
                        this.$message('Successfully sent the new Neural Network!');
                    };
                    const errorFunc = (error) => {
                        console.log('error', error);
                        this.$message(error);
                    };

                    this.loading = true;
                    axios.post('http://localhost:3000/setNetwork', {
                        networkJSON: localNetworkInstance.toJSON()
                    })
                        .then((response) => {
                            this.loading = false;
                            if (response.data && response.data.code === 200) {
                                successFunc();
                            } else {
                                errorFunc(response.data);
                            }
                        })
                        .catch(function (error) {
                            errorFunc(error)
                        });
                } else {
                    this.loading = false;
                    console.log('network is undefined!');
                }
            },
            showResult() {
                this.resultDialogVisible = true;
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
