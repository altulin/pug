export const getElementData = (index) => {
  return `<fieldset class="fill-form__field field-children">
            <legend class="fill-form__title size-1">Данные несовершеннолетнего ребенка</legend>
            <div class="fill-form__box"> 
              <label class="fill-form__label"> <span>Фамилия</span>
                <input class="fill-form__input" type="text" name="${index}-children-surname" placeholder="Фамилия">
              </label>
            </div>
            <div class="fill-form__box"> 
              <label class="fill-form__label"> <span>Имя</span>
                <input class="fill-form__input" type="text" name="${index}-children-name" placeholder="Имя">
              </label>
            </div>
            <div class="fill-form__box">
              <label class="fill-form__label"> <span>Отчество</span>
                <input class="fill-form__input" type="text" name="${index}-children-second-name" placeholder="Отчество">
              </label>
            </div>
          </fieldset>`
};

export const getElementName = (index) => {
  return `<fieldset class="fill-form__field field-children">
<legend class="fill-form__title size-1">Дата рождения</legend>
<div class="fill-form__box box"> 
  <div class="box__inner--third">
    <label class="fill-form__label fill-form__label--select" for="${index}-childrens-day"> <span>День</span></label>
    <div class="fill-form__select-wrap">
      <select class="fill-form__select" id="${index}-childrens-day" name="${index}-childrens-day"> 
        <option value="" selected="">День </option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
        <option value="24">24</option>
        <option value="25">25</option>
        <option value="26">26</option>
        <option value="27">27</option>
        <option value="28">28</option>
        <option value="29">29</option>
        <option value="30">30</option>
        <option value="31">31</option>
      </select>
    </div>
  </div>
  <div class="box__inner--third">
    <label class="fill-form__label fill-form__label--select" for="${index}-childrens-month"> <span>Месяц</span></label>
    <div class="fill-form__select-wrap">
      <select class="fill-form__select" id="${index}-childrens-month" name="${index}-childrens-month"> 
        <option value="" selected="">Месяц</option>
        <option value="1">январь</option>
        <option value="2">февраль</option>
        <option value="3">март</option>
        <option value="4">апрель</option>
        <option value="5">май</option>
        <option value="6">июнь</option>
        <option value="7">июль</option>
        <option value="8">август</option>
        <option value="9">сентябрь</option>
        <option value="10">октябрь</option>
        <option value="11">ноябрь</option>
        <option value="12">декабрь</option>
      </select>
    </div>
  </div>
  <div class="box__inner--third">
    <label class="fill-form__label fill-form__label--select" for="${index}-childrens-year"> <span>Год</span></label>
    <div class="fill-form__select-wrap">
      <select class="fill-form__select" id="${index}-childrens-year" name="${index}-childrens-year">
        <option value="" selected="">Год</option>
        <option value="2003">2003</option>
        <option value="2004">2004</option>
        <option value="2005">2005</option>
        <option value="2006">2006</option>
        <option value="2007">2007</option>
        <option value="2008">2008</option>
        <option value="2009">2009</option>
        <option value="2010">2010</option>
        <option value="2011">2011</option>
        <option value="2012">2012</option>
        <option value="2013">2013</option>
        <option value="2014">2014</option>
        <option value="2015">2015</option>
        <option value="2016">2016</option>
        <option value="2017">2017</option>
        <option value="2018">2018</option>
        <option value="2019">2019</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
      </select>
    </div>
  </div>
</div>
</fieldset>`
};