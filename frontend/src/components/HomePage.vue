<template>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Winkie</title>
    </head>
    <body>
        <div class="wrapper-home-page">
            <header class="the-header">
                <img class="logo" src="../assets/logo.png" border="0" />
                <button v-if="messageAuth.token===''" @click="showLoginModal" class="form-open-button">Авторизоваться</button>
                <p v-if="messageAuth.name!==''&& messageAuth.name!==undefined">Здравствуйте, {{ messageAuth.name }}!</p>
                <button v-if="messageAuth.token!==''" @click="exitProfile" class="exit-profile-button">Выйти из профиля</button>
            </header>
            <div class="content-wrapper">
                <div class="about-block">
                    <button @click="getToStr(1); getFpForSelect(); getCitiesForSelect()" class="btn-to-fp">Написать отзыв</button>
                    <button @click="getToStr(2); getFpForSelect(); getCitiesForSelect(); getReviews(getFilter); this.getNumberReviews(this.filtersReview);">Отзывы</button>
                    <button v-show="messageAuth.admin" @click="getToStr(3)">Администраторская панель</button>
                </div>

                <div v-show="show_fp" class="wrapper-block-fp">
                    <p v-show="messageAuth.id===null">Авторизуйтесь, чтобы оставить отзыв!</p>
                    <div class="block-fp">
                        <div :style="fp.bg_color" class="fp-template" 
                            v-for="(fp, index) in food_points"
                            :key="index">

                            <div v-show="(index >= filterFoodPoints.low_border && index <= filterFoodPoints.up_border)" class="fp">
                                <p> {{ fp.name_food_point }} </p>
                                <img :src="require(`../assets/${fp.img}.png`)">
                                    <p>Категория: {{ fp.type_food_point }}</p>
                                    <p class="">{{ fp.name_city }}</p>
                                    <p>Рейтинг: {{ fp.score }}</p>
                                    <button v-show="messageAuth.id!==null" @click="checkReview(fp.id_food_point, this.messageAuth.id, fp.name_food_point, fp.name_city); ">Написать отзыв</button>
                                </div>
                            </div>
                        </div>
                        <div :style="cssPaddingNumberBlock" class="number-page-block">
                            <span @click="prevPageFp()" v-show="number_page_fp>1" class="prev-page-span"><p>Предыдущая</p></span>
                            <p v-show="countShowFp===0">Для этого города точек питания нет!</p>
                            <span class="number-page-span" v-show="countShowFp>0"><p> {{ number_page }} </p></span>
                            <span @click="nextPageFp()" v-show="number_page_fp !== countShowFp && countShowFp>0" class="next-page-span"><p>Следующая</p></span>
                        </div>
                    </div>

                    <div v-show="showReviewWrite" class="wrapper-review-write-block">
                        <div class="review-write-block">
                            <div>
                            <p>Столовая: {{ reviewWriteData.name_food_point }}</p>
                            
                            <div class="review-write-content">
                                <p>Оцените заведение по следующим пунктам: </p>
                                <div class="rating-area-cleaning-block">
                                    <p>Чистота: </p>
                                    <div class="rating-area-cleaning">
                                        <label id="cleaningLabel1" for="cleaning1">★</label>
                                        <label id="cleaningLabel2" for="cleaning2">★</label>
                                        <label id="cleaningLabel3" for="cleaning3">★</label>
                                        <label id="cleaningLabel4" for="cleaning4">★</label>
                                        <label id="cleaningLabel5" for="cleaning5">★</label>

                                        <input v-model="reviewWriteData.score.cleaning" @click="cons($event.target, 'cleaning')" type="radio" name="cleaning1" id="cleaning1" value="1" >
                                        <input v-model="reviewWriteData.score.cleaning" @click="cons($event.target, 'cleaning')" type="radio" name="cleaning2" id="cleaning2" value="2" >
                                        <input v-model="reviewWriteData.score.cleaning" @click="cons($event.target, 'cleaning')" type="radio" name="cleaning3" id="cleaning3" value="3" >
                                        <input v-model="reviewWriteData.score.cleaning" @click="cons($event.target, 'cleaning')" type="radio" name="cleaning4" id="cleaning4" value="4" >
                                        <input v-model="reviewWriteData.score.cleaning" @click="cons($event.target, 'cleaning')" type="radio" name="cleaning5" id="cleaning5" value="5" >
                                    </div>
                                </div>

                                <div class="rating-area-personal-block">
                                    <p>Работа персонала: </p>
                                    <div class="rating-area-personal">
                                        <label id="personalLabel1" for="personal1">★</label>
                                        <label id="personalLabel2" for="personal2">★</label>
                                        <label id="personalLabel3" for="personal3">★</label>
                                        <label id="personalLabel4" for="personal4">★</label>
                                        <label id="personalLabel5" for="personal5">★</label>

                                        <input v-model="reviewWriteData.score.personal" @click="cons($event.target, 'personal')" type="radio" name="personal1" id="personal1"  value="1" >
                                        <input v-model="reviewWriteData.score.personal" @click="cons($event.target, 'personal')" type="radio" name="personal2" id="personal2"  value="2" >
                                        <input v-model="reviewWriteData.score.personal" @click="cons($event.target, 'personal')" type="radio" name="personal3" id="personal3"  value="3" >
                                        <input v-model="reviewWriteData.score.personal" @click="cons($event.target, 'personal')" type="radio" name="personal4" id="personal4"  value="4" >
                                        <input v-model="reviewWriteData.score.personal" @click="cons($event.target, 'personal')" type="radio" name="personal5" id="personal5"  value="5" >
                                    </div>
                                </div>

                                <div class="rating-area-speed-block">
                                    <p>Скорость обслуживания: </p>
                                    <div class="rating-area-speed">
                                        <label id="speedLabel1" for="speed1">★</label>
                                        <label id="speedLabel2" for="speed2">★</label>
                                        <label id="speedLabel3" for="speed3">★</label>
                                        <label id="speedLabel4" for="speed4">★</label>
                                        <label id="speedLabel5" for="speed5">★</label>

                                        <input v-model="reviewWriteData.score.speed" @click="cons($event.target, 'speed')" type="radio" name="speed1" id="speed1"  value="1" >
                                        <input v-model="reviewWriteData.score.speed" @click="cons($event.target, 'speed')" type="radio" name="speed2" id="speed2"  value="2" >
                                        <input v-model="reviewWriteData.score.speed" @click="cons($event.target, 'speed')" type="radio" name="speed3" id="speed3"  value="3" >
                                        <input v-model="reviewWriteData.score.speed" @click="cons($event.target, 'speed')" type="radio" name="speed4" id="speed4"  value="4" >
                                        <input v-model="reviewWriteData.score.speed" @click="cons($event.target, 'speed')" type="radio" name="speed5" id="speed5"  value="5" >
                                    </div>
                                </div>

                                <div class="rating-area-cook-block">
                                    <p>Кухня: </p>
                                    <div class="rating-area-cook">
                                        <label id="cookLabel1" for="cook1">★</label>
                                        <label id="cookLabel2" for="cook2">★</label>
                                        <label id="cookLabel3" for="cook3">★</label>
                                        <label id="cookLabel4" for="cook4">★</label>
                                        <label id="cookLabel5" for="cook5">★</label>

                                        <input v-model="reviewWriteData.score.cook" @click="cons($event.target, 'cook')" type="radio" name="cook1" id="cook1"  value="1" >
                                        <input v-model="reviewWriteData.score.cook" @click="cons($event.target, 'cook')" type="radio" name="cook2" id="cook2"  value="2" >
                                        <input v-model="reviewWriteData.score.cook" @click="cons($event.target, 'cook')" type="radio" name="cook3" id="cook3"  value="3" >
                                        <input v-model="reviewWriteData.score.cook" @click="cons($event.target, 'cook')" type="radio" name="cook4" id="cook4"  value="4" >
                                        <input v-model="reviewWriteData.score.cook" @click="cons($event.target, 'cook')" type="radio" name="cook5" id="cook5"  value="5" >
                                    </div>
                                </div>
                                
                                <div class="review-text-block">
                                    <p>Будем рады вашему более подробному отзыву<br>(по желанию): </p>
                                    <textarea v-model="this.reviewWriteData.text" class="input_text_review"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="button-review-write">
                            <button :disabled="disabledButtonSendReview" @click="getFpForSelect(); addDataToReviewWriteData(this.reviewWriteData.id_food_point, this.reviewWriteData.id_user, this.reviewWriteData.text, this.reviewWriteData.score, true, null, null)" >Отправить</button>
                            <button @click="closeReviewWrite()">Закрыть форму</button>
                        </div>
                    </div>
                </div>

                <div v-show="show_fp" class="block-filter">
                    <h1>Фильтры</h1>
                    <div class="wrapper-select-city">
                        <select v-model="filterFoodPoints.id_city" name="city" class="city-filter">
                            <option value=null>Все города</option>
                            <option v-for="city in cities" 
                                    :key="city.id_city" 
                                    :value="city.id_city">{{ city.name_city }}</option>
                        </select>
                    </div>
                    <button @click="getFpForSelect(filterFoodPoints)"
                    >Фильтровать</button>
                </div>

                <div v-show="show_review" class="wrapper-block-reviews">
                    <div class="block-reviews">
                        <div class="review-template" 
                            v-for="(review, index) in allReview"
                            :key="index">
                            <div v-show="index >= filtersReview.low_border && index <= filtersReview.up_border" class="review"
                            >
                                <p>Точка питания: {{ review.name_food_point }}</p>
                                <img v-if="require(`../assets/${review.img}.png`) !== undefined" :src="require(`../assets/${review.img}.png`)">
                                <p>{{ review.nickname }}</p>
                                <p>{{ review.text }}</p>

                                <p><br>Оценка: {{ review.score }}</p>

                                <p><br>{{ review.name_city }}</p>
                                <button v-if="messageAuth.admin" @click="deleteReview(review.id_review, admin_commands.reviews.deleteReview.req)" class="deleteReview"></button>
                            </div>
                        </div>
                    </div>
                    <div :style="cssPaddingNumberBlock" class="number-page-block">
                        <span @click="prevPage()" v-show="number_page>1" class="prev-page-span"><p>Предыдущая</p></span>
                        <p v-show="countShowReviews===0">Для данных фильтров отзывов нет!</p>
                        <span class="number-page-span" v-show="countShowReviews>0"><p> {{ number_page }} </p></span>
                        <span @click="nextPage()" v-show="number_page!==countShowReviews && countShowReviews>0" class="next-page-span"><p>Следующая</p></span>
                    </div>
                </div>


                <div v-show="show_review" class="block-filter">
                    <h1>Фильтры</h1>
                    <div class="wrapper-select-city">
                        <select v-model="filtersReview.id_city" name="city" class="city-filter">
                            <option value=null>Все города</option>
                            <option v-for="city in cities"
                                    :key="city.id_city"
                                    :value="city.id_city">
                                {{ city.name_city }}
                            </option>
                        </select>
                    </div>
                    <div class="wrapper-select-fp">
                        <select v-model="filtersReview.id_food_point" name="fp" class="fp-filter">
                            <option value=null>Все точки питания</option>
                            <option v-for="fp in id_food_point_select" :key="fp.id_food_point" :value="fp.id_food_point"> {{ fp.name_food_point }} </option>
                        </select>
                    </div>
                    <div v-show="messageAuth.token" class="wrapper-select-my-id">
                        <p>Выбрать мои отзывы</p>
                        <input v-model="filtersReview.my_rew" type="checkbox">
                    </div>
                    <button @click="getReviewsToReq()">Фильтровать</button>
                </div>
                <div v-if="show_admin_panel" class="wrapper-panel-admin">
                    <div class="block-panel-admin">
                        <div 
                            v-for="(reqs, index) in Object.keys(admin_commands)"
                            :key="index"
                            class="request-content-block">
                            <div class="reqs-block">
                                <p>Запросы для: {{ reqs }}</p>
                                <div 
                                    class="req-block"
                                    v-for="(req, index) in admin_commands[`${reqs}`]"
                                    :key="index"
                                >
                                    <p>{{ req.description }}</p>
                                    <div class="req-and-button-block">
                                        <p>{{ req.req }}</p>
                                        <button @click="reqAdmin(req)">Отправить</button>
                                    </div>
                                    
                                    <div v-for="(attr, index) in req.required_parameters" :key=index class="req-input">
                                        <input v-model="req.param[attr]" :placeholder="attr" type="text">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div v-show="!showLogin" class="modal-login">
                <div class="form_auth_block_content">
                    <p class="form_auth_block_head_text">Авторизация</p>
                    <div class="form_auth_style">
                        <div class="login-block">
                            <label>Введите логин</label>
                            <input v-model="authLogin" type="email" class="auth-email" placeholder="email@mail.ru" required >
                        </div>
                        <div class="pass-block">
                            <label>Введите пароль</label>
                            <input v-model="authPass" type="password" class="auth-pass" placeholder="Минимум 8 символов" required >
                        </div>
                        <div class="button-auth-reg-block">
                            <button @click="authUser()" class="form-auth-button" type="submit">Войти</button>
                            <button @click="showLogin = !showLogin; showReg = !showReg" class="form-reg-button" type="submit">Зарегистрироваться</button>
                        </div>
                        <div class="button-close-modal-login">
                            <button @click="showLogin = !showLogin">Закрыть</button>
                        </div>
                        <p> {{ messageAuth.text }} </p>
                    </div>
                </div>
            </div>


            <div v-show="!showReg" class="modal-reg">
                <div class="form_reg_block_content">
                    <p class="form_reg_block_head_text">Регистрация</p>
                    <div class="form_reg_style">
                        <div class="nickname-block">
                            <label>Введите имя</label>
                            <input v-model="regData.nickname" type="text" class="nickname" placeholder="Минимум 3 символа" required >
                            <p v-show="regData.nickname.length<2 || regData.nickname.length>20">Минимум 3 и максимум 20 символов</p>
                        </div>
                        <div class="reg-block">
                            <label>Введите логин</label>
                            <input v-model="regData.regLogin" type="email" class="auth-email" placeholder="email@mail.ru" required >
                        </div>
                        <div class="pass-block">
                            <label>Введите пароль</label>
                            <input v-model="regData.regPass" type="password" class="auth-pass" placeholder="Минимум 8 символов" required >
                            <p v-show="regData.regPass.length<8 || regData.regPass.length>50">Минимум 8 и максимум 50 символов</p>
                        </div>
                        <div class="pass-block pass-confirm-block">
                            <label>Введите подтверждение пароля</label>
                            <input v-model="regData.regPassConfirm" type="password" class="auth-pass" placeholder="Минимум 8 символов" required >
                            <p v-show="regData.regPass!==regData.regPassConfirm">Пароли должны совпадать</p>
                        </div>
                        <div class="button-reg-block">
                            <button :disabled="(regData.regPass === regData.regPassConfirm) &&
                                                (regData.regPass.length>8 && regData.regPass<50) &&
                                                (regData.regLogin !== null) &&
                                                (regData.nickname.length>3&&regData.nickname.length<20)" @click="regUser()" class="form-reg-button" type="submit">Зарегистрироваться</button>
                        </div>
                        <div class="button-close-modal-reg">
                            <button  @click="showReg = !showReg; messageReg = null">Закрыть</button>
                        </div>
                        <p class="messageReg"> {{ messageReg }} </p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
import store from '@/store'
import {mapGetters, mapActions} from 'vuex'
import { useScriptTag } from '@vueuse/core'

useScriptTag('https://platform.twitter.com/widgets.js')

export default {
  name: 'HomePage',
  computed: {
    ...mapGetters(['allReview', 'getFilter']),
    disabledButtonSendReview() {
        let req = true
        if(this.reviewWriteData.score.cleaning!==null) {
            if(this.reviewWriteData.score.personal!==null) {
                if(this.reviewWriteData.score.speed!==null) {
                    if(this.reviewWriteData.score.cook!==null) {
                        req = false
                    }
                }
            }
        }
        return req
    },
    cssPaddingNumberBlock() {
        let padding = '40px 80px 40px'
        if(this.number_page < 2) {
            padding = '40px 160px 40px'
        }
        return {padding}
    },
    id_food_point_select() {
        let id_city = this.filtersReview.id_city
        let arrFpToCity = this.food_points.filter(function(fp, ) {
            fp.bg_color = {'background-color': 'white'}
            if (id_city !== null && id_city !== 'null') {
                if (fp.id_city === id_city) {
                    return fp
                }
            } else if (id_city === null || id_city === 'null') {
                return fp
            }
        })
        return arrFpToCity
    }
  },
  watch: {
    selectFpToReview(newF, oldF) {
        this.food_points[oldF].bg_color = {'background-color': 'white'}
        this.food_points[newF].bg_color = {'background-color': '#ECF0F3'}
    }
  },
  data() {  
    return {
        reviewWriteData: {
            id_food_point: null,
            id_user: null,
            text: '',
            score: {
                cleaning: null,
                personal: null,
                speed: null,
                cook: null
            },
            name_food_point: '',
            name_city: ''
        },
        showReviewWrite: false,
        countShowFp: null,
        countFp: null,
        selectFpToReview: 0,
        showLogin: true,
        showReg: true,
        authPass: null,
        authLogin: null,
        regData: {
            nickname: '',
            regLogin: '',
            regPass: '',
            regPassConfirm: ''
        },
        messageAuth: {
            text: '',
            token: '',
            admin: '',
            id: ''
        },
        messageReg: null,
        tokenConf: null, 
        filtersReview: {
            id_food_point: null,
            id_user: null,
            id_city: null,
            low_border: 0,
            up_border: 8
        },
        filterFoodPoints: {
            id_city: null,
            low_border: 0,
            up_border: 8
        },
        countReviews: null,
        countShowReviews: null,
        number_page: 1,
        number_page_fp: 1,
        cities: null,
        food_points: [],
        admin_commands: {
            'delete': ''
        },
        show_review: true,
        show_fp: false,
        show_admin_panel: false
    }
  },
  mounted() {
     if(document.cookie) {
        this.getConfirmToken(this.getCookie('token')).then(result => {
            if(result.token) {
                this.filtersReview.token = result.token;
                this.messageAuth.token = result.token;
                this.messageAuth.id = result.auth_data.id;
                this.messageAuth.name = result.auth_data.name;
                if(result.admin === true) {
                    this.messageAuth.admin = true
                }
                this.admin_commands = result.admin_commands
            } else {
                this.messageAuth.token = '';
                this.messageAuth.text = '';
                this.messageAuth.id = '';
                this.messageAuth.admin = '';
                this.admin_commands = '';
                this.messageAuth.name = '';
            }
        })
     }
     this.getCitiesForSelect();
     this.getFpForSelect();
     this.getNumberReviews(this.filtersReview);
  },
  methods: {
    ...mapActions([
        'getReviews',
        'getConfirmToken',
        'changeFilter',
        'getDataReviewsToPage',
        'getMessageAuth',
        'setReviewAcsess'
    ]),
    showLoginModal() {
        this.showLogin = !this.showLogin;
    },
    async exitProfile() {
        let bodyToken = {
            'token': this.getCookie('token')
        }
        await fetch('http://localhost:8080/UR/deleteToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(bodyToken)
        })
        this.deleteCookie('token');
        this.messageAuth.token = '';
        this.messageAuth.text = '';
        this.messageAuth.id = '';
        this.messageAuth.admin = '';
        this.admin_commands = '';
        this.messageAuth.name = '';
    },
    async authUser() {
        const loginData = {
            "email": this.authLogin,
            "password": this.authPass
        }
        this.messageAuth = await fetch('http://localhost:8080/UR/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(loginData)
        }).then(result => {
            return result.json();
        });
        this.admin_commands = this.messageAuth.admin_commands

        if(this.messageAuth.token) {
            this.setCookie('token', this.messageAuth.token, {'max-age': 3600})
            console.log(document.cookie)
            setTimeout(() => {
                this.showLoginModal()
            }, 2000);
        }
    },
    prevPage() {
        this.filtersReview.low_border = this.filtersReview.low_border - 9;
        this.filtersReview.up_border = this.filtersReview.up_border - 9;
        store.dispatch('getDataReviewsToPage', {low_border: this.filtersReview.low_border, up_border: this.filtersReview.up_border})
        this.number_page--;
    },
    nextPage() {
        this.filtersReview.low_border = this.filtersReview.low_border + 9;
        this.filtersReview.up_border = this.filtersReview.up_border + 9;
        store.dispatch('getDataReviewsToPage', {low_border: this.filtersReview.low_border, up_border: this.filtersReview.up_border})
        this.number_page++;
    },
    prevPageFp() {
        this.filterFoodPoints.low_border = this.filterFoodPoints.low_border - 9;
        this.filterFoodPoints.up_border = this.filterFoodPoints.up_border - 9;
        this.number_page_fp--;
    },
    nextPageFp() {
        this.filterFoodPoints.low_border = this.filterFoodPoints.low_border + 9;
        this.filterFoodPoints.up_border = this.filterFoodPoints.up_border + 9;
        this.number_page_fp++;
    },
    getReviewsToReq() {
        this.filtersReview.low_border = 0;
        this.filtersReview.up_border = 8;
        if(this.filtersReview.my_rew) {
            this.filtersReview.id_user = this.messageAuth.id;
        } else {
            this.filtersReview.id_user = null
        }
        store.dispatch('getReviews', this.filtersReview);
        this.getNumberReviews();
        this.number_page = 1;
    },
    async getCitiesForSelect() {
        this.cities = await fetch('http://localhost:8080/CR/get_cities').then(result => {
            return result.json();
        })
    },
    async getFpForSelect(id_city) {
        let req = {
            id_city: id_city,
            user_id: this.messageAuth.id
        }
        this.food_points = await fetch('http://localhost:8080/FR/get_fp_to_city', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(req)
        }).then(result => {
            return result.json();
        })
        this.countFp = this.food_points.length;
        this.countShowFp = Math.ceil(this.countFp/9);
    },
    async getNumberReviews() {
        this.countReviews = await fetch('http://localhost:8080/RR/get_number_reviews', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(this.filtersReview)
        }).then(result => {
            return result.json()
        });
        this.countShowReviews = Math.ceil(this.countReviews/9);
    },
    async regUser() {
        this.messageReg = await fetch('http://localhost:8080/UR/registration', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(this.regData)
        }).then(result => {
            return result.json()
        });
        if(this.messageReg === 'Успешная регистрация!') {
            setTimeout(() => {
                this.showReg = !this.showReg
            }, 2000);
            alert("Войдите под своим логином!")
        }
    },
    async deleteReview(review_id, address) {
        let review_data = {
            review_id: review_id
        }
        await fetch(address, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(review_data)
        }).then(result => {
            alert('Отзыв удалён!')
            return result.json()
        })
        this.getReviewsToReq()
    },
    setCookie(name, value, options = {}) {
        options = {
        path: '/',
        ...options
        };

        if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
        }
        document.cookie = updatedCookie;
    },
    deleteCookie(name) {
        this.setCookie(name, "", {
            'max-age': -1
        })
    },
    /* eslint-disable */
    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        console.log(matches ? decodeURIComponent(matches[1]) : undefined)
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    getToStr(str) {
        switch(str) {
            case 1: {
                this.show_fp = true
                this.show_review = false
                this.show_admin_panel = false
                break
            }
            case 2: {
                this.show_fp = false
                this.show_review = true
                this.show_admin_panel = false
                break
            }
            case 3: {
                this.show_fp = false
                this.show_review = false
                this.show_admin_panel = true
                break
            }
        }
    },
    async addDataToReviewWriteData(id_fp, id_user, text, score, send, name_fp, name_city) {
        if(send === true) {
            this.writeReviewRes = await fetch('http://localhost:8080/RR/add_review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    'id_food_point': id_fp,
                    'id_user': id_user, 
                    'text': text, 
                    'score': (Number(score.cleaning)+Number(score.personal)+Number(score.speed)+Number(score.cook))/4
                })
            })
            this.closeReviewWrite()
        } else {
            this.reviewWriteData.id_food_point = id_fp;
            this.reviewWriteData.id_user = id_user;
            this.reviewWriteData.name_food_point = name_fp;
            this.reviewWriteData.name_city = name_city;
        }
    },
    cons(el, rating_name) {

        let arrElStar = [
            document.getElementById(rating_name+1),
            document.getElementById(rating_name+2),
            document.getElementById(rating_name+3),
            document.getElementById(rating_name+4),
            document.getElementById(rating_name+5)
        ]

        function changeStarAtr(countStars) {
            for(let i = 0; i <= countStars; i++) {
                arrElStar[i].checked = true
                document.getElementById(rating_name + `Label${i+1}`).style = "color: red"
            }
            for(let i = 4; i > countStars; i--) {
                document.getElementById(rating_name + `Label${i+1}`).style = "color: none"
            }
        }

        if(el.id === rating_name+1) {
            document.getElementById(rating_name + `Label1`).style = "color: red"
            for(let i = 4; i > 0; i--) {
                document.getElementById(rating_name + `Label${i+1}`).style = "color: none"
            }
        } else if (el.id === rating_name+2) {
            changeStarAtr(1)
        } else if(el.id === rating_name+3) {
            changeStarAtr(2);
        } else if(el.id ===rating_name+4) {
            changeStarAtr(3);
        } else if(el.id === rating_name+5) {
            changeStarAtr(4);
        }
    },
    closeReviewWrite() {

        this.showReviewWrite=!this.showReviewWrite; 
        this.reviewWriteData.score.cleaning = null; 
        this.reviewWriteData.score.personal = null; 
        this.reviewWriteData.score.speed = null; 
        this.reviewWriteData.score.cook = null; 
        this.reviewWriteData.text = null;

        for(let i = 1; i < 6; i++) {
            document.getElementById('cleaning' + `Label${i}`).style = "color: none"
            document.getElementById('personal' + `Label${i}`).style = "color: none"
            document.getElementById('speed' + `Label${i}`).style = "color: none"
            document.getElementById('cook' + `Label${i}`).style = "color: none"
        }

    },
    async checkReview(id_fp, id_user, name_fp, name_city) {
        let req = {
            id_food_point: id_fp,
            id_user: id_user
        }
        let message = await fetch('http://localhost:8080/RR/checkReview', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(req)
        }).then(result => {
            return result.json()
        })
        if(message.confirm) {
            this.addDataToReviewWriteData(id_fp, id_user, null, null, false, name_fp, name_city); 
            this.showReviewWrite = true
        } else {
            alert(message.text)
        }
    },
    async reqAdmin(req) {
        let message = null;
        if(req.method === 'POST') {
            message = await fetch(`${req.req}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                body: JSON.stringify(req.param)
            }).then(result => {
                return result.json()
            })

        } else if(req.method === 'GET') {
            message = await fetch(`${req.req}`).then(result => {
                return result.json()
            })
        }
        let message_in_stroke = ``
        if(message.lenght !== undefined && ((typeof message) !== 'string')) {
            for(let el of message) {
                message_in_stroke = message_in_stroke + `\n`
                for(let sv in el) {
                    message_in_stroke = message_in_stroke + sv + `: ` +el[`${sv}`] + `; `
                }
                message_in_stroke = message_in_stroke + `\n`
            }   
            alert(message_in_stroke)
        } else {alert(JSON.stringify(message))}
        // alert(JSON.stringify(message))
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .wrapper-home-page {
        width: 100%;
        max-width: 1440px;
        height: 1000px;
        background: #ECF0F3;

        .the-header {
            padding-top: 46px;
            padding-left: 100px;
            padding-right: 130px;
            padding-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .logo {
                width: 80px;
                height: 80px;
            }

            .form-open-button {
                width: 150px;
                height: 40px;
                background: #FFFFFF;
                border: 1px solid #9A9494;
                border-radius: 5px;
            }

            .exit-profile-button {
                width: 150px;
                height: 40px;
                background: #FFFFFF;
                border: 1px solid #9A9494;
                border-radius: 5px;
            }
        }

        .content-wrapper {
            width: 100%;
            background: #ECF0F3;
            display: flex;
            padding-top: 20px;
            padding-left: 5%;

            .about-block {
                width: 18%;
                height: 250px;
                background: #FFFFFF;
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);
                padding: 20px;

                button {
                    display: block;
                    margin: 20px auto 20px;
                    width: 150px;
                    height: 40px;
                    background: #FFFFFF;
                    border: 1px solid #9A9494;
                    border-radius: 5px;
                }
            }

            .wrapper-block-reviews {
                width: 40%;
                margin-left: 100px;
                margin-right: 50px;
                background: #FFFFFF;
                padding: 20px 10px 10px 10px;
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);

                .block-reviews {
                    display: grid;
                    grid-template-columns: 30% 30% 30%;
                    width: 100%;
                    justify-content: space-around;
                    //.review-template {
                    //  img {
                    //    height: 150 px;
                    //   weidth: 150 px;
                    //}
                    //    }

                    .review {
                        padding: 10px;
                        margin-bottom: 20px;
                        text-align: center;
                        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);

                        img {
                            height: 150px;
                            width: 150px;
                            margin-top: 10px;
                            margin-bottom: 10px;
                        }
                    }
                }

                .number-page-block {
                    display: flex;
                    padding: 40px;
                    padding-left: 80px;
                    padding-right: 80px;
                    justify-content: space-around;
                    align-items: center;

                    .number-page-span {
                        font-size: 20px;
                    }

                    .prev-page-span, .next-page-span {
                        font-size: 17px;
                        padding: 3px 13px 3px;
                        border: 1px solid black;
                        border-radius: 20px;
                    }
                }
            }

            .wrapper-review-write-block {
                width: 100%;
                position: absolute;
                background: #bbb2b296;
                z-index: 2;
                right: 0;
                left: 0;
                top: 0;
                bottom: 0;

                .review-write-block {
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 5%;
                    width: 35%;
                    padding-top: 100px;
                    background: #abd2f0;
                    text-align: center;

                    .review-write-content {
                        .rating-area-cleaning-block {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding-left: 90px;
                            padding-right: 90px;

                            p {
                                margin-right: 20px;
                            }

                            .rating-area-cleaning {
                                label {
                                    font-size: 30px;
                                }

                                input {
                                    display: none;
                                }
                            }
                        }

                        .rating-area-personal-block {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding-left: 90px;
                            padding-right: 90px;

                            p {
                                margin-right: 20px;
                            }

                            .rating-area-personal {
                                label {
                                    font-size: 30px;
                                }

                                input {
                                    display: none;
                                }
                            }
                        }

                        .rating-area-speed-block {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding-left: 90px;
                            padding-right: 90px;

                            p {
                                margin-right: 20px;
                            }

                            .rating-area-speed {
                                label {
                                    font-size: 30px;
                                }

                                input {
                                    display: none;
                                }
                            }
                        }

                        .rating-area-cook-block {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding-left: 90px;
                            padding-right: 90px;

                            p {
                                margin-right: 20px;
                            }

                            .rating-area-cook {
                                label {
                                    font-size: 30px;
                                }

                                input {
                                    display: none;
                                }
                            }
                        }
                    }

                    .review-text-block {
                        padding-top: 40px;

                        p {
                            font-size: 21px;
                            margin-bottom: 20px;
                        }

                        textarea {
                            resize: none;
                            width: 85%;
                            height: 50px;
                            padding: 10px;
                        }
                    }

                    .button-review-write {
                        padding: 70px;
                        display: flex;
                        justify-content: space-around;

                        button {
                            width: 130px;
                            height: 30px;
                            background: #FFFFFF;
                            border: 1px solid #9A9494;
                            border-radius: 5px;
                        }
                    }
                }
            }

            .wrapper-block-fp {
                width: 40%;
                margin-left: 100px;
                margin-right: 50px;
                background: #FFFFFF;
                padding: 20px 10px 10px 10px;
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);

                .block-fp {
                    display: grid;
                    grid-template-columns: 30% 30% 30%;
                    width: 100%;
                    justify-content: space-around;

                    .review-template {
                        img {
                            height: 150 px;
                            weidth: 150 px;
                        }
                    }

                    .fp {
                        padding: 10px;
                        margin-bottom: 20px;
                        text-align: center;
                        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);

                        img {
                            width: 150px;
                            height: 150px;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                    }
                }
            }

            .block-filter {
                width: 15%;
                right: 0;
                height: 200px;
                margin-top: 40px;
                padding-top: 30px;
                background: #FFFFFF;
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);
                text-align: center;

                h1 {
                    margin-bottom: 20px;
                }

                button {
                    width: 100px;
                    height: 30px;
                    background: #FFFFFF;
                    border: 1px solid #9A9494;
                    border-radius: 5px;
                }

                .wrapper-select-city {
                    padding: 10px;
                    display: flex;
                    justify-content: center;

                    .city-filter {
                        width: 70%;
                    }
                }

                .wrapper-select-fp {
                    padding: 10px;
                    display: flex;
                    justify-content: center;

                    .fp-filter {
                        width: 95%;
                    }
                }

                .wrapper-select-my-id {
                    padding: 10px;
                    display: flex;
                    justify-content: center;
                }
            }

            .wrapper-panel-admin {
                width: 50%;
                right: 0;
                margin-left: 100px;
                padding: 20px 10px 40px;
                background: #FFFFFF;
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);
                text-align: center;

                .block-panel-admin {
                    .request-content-block {
                        margin-bottom: 50px;

                        p {
                            font-size: 25px;
                            margin-bottom: 20px;
                        }

                        .reqs-block {
                            margin-bottom: 20px;

                            .req-block {
                                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), -1px -1px 4px rgba(0, 0, 0, 0.25);
                                margin-bottom: 20px;
                                padding: 20px;

                                p {
                                    font-size: 17px;
                                    margin-bottom: 20px;
                                }

                                .req-and-button-block {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    text-align: left;
                                    padding: 0px 30px 20px;

                                    p {
                                        font-size: 22px;
                                    }

                                    button {
                                        background: #FFFFFF;
                                        border: 1px solid #9A9494;
                                        border-radius: 5px;
                                        text-align: center;
                                    }
                                }

                                .req-input {
                                    margin: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }

        .modal-login {
            background: #bbb2b296;
            width: 100%;
            position: absolute;
            z-index: 2;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
            margin-left: auto;
            margin-right: auto;

            .form_auth_block_content {
                margin-left: auto;
                margin-right: auto;
                margin-top: 5%;
                width: 35%;
                padding-top: 100px;
                height: 50vh;
                background: #abd2f0;
                text-align: center;

                p {
                    font-size: 30px;
                    margin-bottom: 40px;
                }

                .form_auth_style {
                    display: block;

                    .login-block {
                        label {
                            font-size: 20px;
                        }

                        .auth-email {
                            margin: 10px;
                        }
                    }

                    .pass-block {
                        label {
                            font-size: 20px;
                        }

                        margin-bottom: 25px;

                        .auth-pass {
                            margin: 10px;
                        }
                    }

                    .button-auth-reg-block {
                        margin-bottom: 20px;

                        .form-auth-button {
                            width: 100px;
                            height: 30px;
                            background: #FFFFFF;
                            border: 1px solid #9A9494;
                            border-radius: 5px;
                        }

                        .form-reg-button {
                            margin-left: 50px;
                            width: 150px;
                            height: 30px;
                            background: #FFFFFF;
                            border: 1px solid #9A9494;
                            border-radius: 5px;
                        }
                    }

                    .button-close-modal-login {
                        display: flex;
                        justify-content: end;
                        margin-top: 70px;
                        padding-right: 50px;

                        button {
                            width: 150px;
                            height: 30px;
                            background: #FFFFFF;
                            border: 1px solid #9A9494;
                            border-radius: 5px;
                        }
                    }

                    p {
                        font-size: 22px;
                    }
                }
            }
        }

        .modal-reg {
            background: #bbb2b296;
            width: 100%;
            position: absolute;
            z-index: 2;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
            margin-left: auto;
            margin-right: auto;

            .form_reg_block_content {
                margin-left: auto;
                margin-right: auto;
                margin-top: 5%;
                width: 35%;
                padding-top: 100px;
                background: #abd2f0;
                text-align: center;

                p {
                    font-size: 30px;
                    margin-bottom: 40px;
                }

                .form_reg_style {
                    display: block;

                    .nickname-block {
                        label {
                            font-size: 20px;
                        }

                        input {
                            margin: 10px;
                        }

                        p {
                            font-size: 15px;
                            margin-bottom: 10px;
                        }
                    }

                    .reg-block {
                        label {
                            font-size: 20px;
                        }

                        .auth-email {
                            margin: 10px;
                        }
                    }

                    .pass-block {
                        label {
                            font-size: 20px;
                        }

                        margin-bottom: 0px;

                        .auth-pass {
                            margin: 10px;
                        }

                        p {
                            font-size: 15px;
                        }
                    }

                    .pass-confirm-block {
                        margin-bottom: 25px;
                    }

                    .button-reg-block {
                        margin-bottom: 20px;

                        .form-reg-button {
                            margin-left: 50px;
                            width: 150px;
                            height: 30px;
                            background: #FFFFFF;
                            border: 1px solid #9A9494;
                            border-radius: 5px;
                        }
                    }

                    .button-close-modal-reg {
                        display: flex;
                        justify-content: end;
                        margin-top: 70px;
                        padding-right: 50px;

                        button {
                            width: 150px;
                            height: 30px;
                            background: #FFFFFF;
                            border: 1px solid #9A9494;
                            border-radius: 5px;
                        }
                    }

                    p {
                        font-size: 22px;
                    }

                    .messageReg {
                        padding-top: 20px;
                        padding-bottom: 20px;
                    }
                }
            }
        }
    }
</style>
