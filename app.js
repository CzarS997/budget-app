//  BUDGET CONTROLLER
var BudControl = (function(){ 

    var Expense = function(id, description, value) {
        
        this.id = id;
        this.description = description;
        this.value = value; 
        this.percentage = -1;
    };
    
    Expense.prototype.calcPerce = function(totalInc){
        
        if(totalInc > 0){
            
        this.percentage = Math.round((this.value / totalInc) * 100);
            
        }   else {
            
            this.percentage = -1;
        }
        
    };
    
    Expense.prototype.getPerc = function(){
        
        return this.percentage;
        
    }
    
    
     var Income = function(id, description, value) {
        
        this.id = id;
        this.description = description;
        this.value = value;    
    };
    
    var calcTotal = function(type){
        
        var sum = 0;
        
        data.allItems[type].forEach(function(curr){
            
            sum += curr.value;
            
            
        });
        data.totals[type] = sum;
        
    };
    
    var data = {
        
    allItems:{
        
        exp: [],
        inc: []
    },
        
    totals: {
        
        inc: 0,    
        exp: 0   
    },
    
    budget: 0,
    percentage: -1,
    sessLong: []
}
      
    return {
        
        addItem: function(type, des, val){
            var newItem, ID;


            //Create a new ID
            if(data.allItems[type].length > 0){
                
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            data.sessLong.push(ID);

            } else{

                data.sessLong.push(ID);
                ID = 0;
            }
            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp')
                {
                    newItem = new Expense(ID, des, val);
                   
                } else if(type == 'inc'){
                    
                    newItem = new Income(ID,des,val);

                }
            //Push it into data structure
            data.allItems[type].push(newItem);
            let x = des+','+val;
            let y = type + ',' + ID;
            //console.log(x);
            //console.log(ID);
            sessionStorage.setItem(y, x);
            
            // Return the new element
            return newItem;
            
        },
        
        deleteItem: function(type, id){
            var ids, index;
            
            ids = data.allItems[type].map(function(curr){
                
               return curr.id; 
            
            });
            
            index = ids.indexOf(id);
            console.log(index);
            if(index !== -1){
                let key = type + ',' + index ;
                //console.log(`Key of removed item: ${key}`);
                
                data.allItems[type].splice(index, 1);
                sessionStorage.removeItem(key);
            }
            
            
        },
        
        
        calcBudg: function(){
            
          // Calculate total income and expenses  
            calcTotal('exp');
            calcTotal('inc');
            
          //Calc budget(inc - exp)    
          
            data.budget = data.totals.inc - data.totals.exp;
            
          //calc the percentage of income that we spent
            if(data.totals.inc > 0)
                {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                
                data.percentage = -1;
            }
            
        },
        
        calcPerc: function(){
            
            data.allItems.exp.forEach(function(curr){
                
                curr.calcPerce(data.totals.inc);
                
            });
            
        },
        
        getPercent: function(){
            
            var allPerc = data.allItems.exp.map(function(curr){
                
                return curr.getPerc();
                
                
            });
            return allPerc;
            
        },
        
        getBudg: function(){
            
          return {
              
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          }
                
        },

        test: function(){
            
            console.log(data);
        },

        zeroBudg: function(){

            data.budget = 0;
            data.totals.inc = 0;
            data.totals.exp = 0;
            data.percentage = -1;
            data.allItems.exp = [];
            data.allItems.inc = [];

        },

        getLongest: () => {
            
            let x,y,z;
            for(x = 0; x < data.sessLong.length + 1; x++){

                y = x - 1;
                if(x === 0) {
                    z = data.sessLong[x];
                }
                else if(data.sessLong[x] >= z) {
                    z = data.sessLong[x];
                } 
            };

            return z;
        }
    };
    
    
        
})();


//  JUST AN UI CONTROLLER
var UIControl = (function(){

    var DString = {
        
        inType: '.add__type',
        inDesc: '.add__description',
        inValue: '.add__value',
        inBtn: '.add__btn',
        inCont: '.income__list',
        expCont: '.expenses__list',
        budgLabel:'.budget__value',
        incLabel: '.budget__income--value',
        expLabel: '.budget__expenses--value',
        percLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        trash: '.remove_list',
        retBin: '.mesBox'
    };
    
    
    var formNumber = function(num,type){
            
            var numSplit, int, dec, type;
            // '+','-','.' should be added
            // 4502.4523 -> 4,502.45
            // 1000 -> + 1000
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            //integer part 
            int = numSplit[0];
            //decimal part
            dec = numSplit[1];
            
            if(int.length > 3){
                
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3,3);
                
            }
            
            dec = numSplit[1];
            
            
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        };
    
    var nodeListForEach = function(list, callback){
                
               for ( var j = 0; j < list.length; j++){
                   
                   callback(list[j], j);
                   
               } 
                 
        };
    
    return {
        
      getinput: function(){
          
          return{
          
          type : document.querySelector(DString.inType).value,    //Will be inc or exp,
          description : document.querySelector(DString.inDesc).value,
          value : parseFloat(document.querySelector(DString.inValue).value)
          
          };
      },  
      
        addListItem: function(obj,type){
            
            var html, newHtml;
            
            // HTML string with placeholder text
            
            if(type === 'exp'){
                
                element = DString.expCont;
                
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete">    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
                
            }   else if(type === 'inc'){
            
                element = DString.inCont;
                
             html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    
                
            }
            
            
            //Replace placeholder with actual data
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formNumber(obj.value,type));
            
            
            //Insert the HTML into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
            
        },
        
            delListItem: function(IDs){
                
                var el = document.getElementById(IDs);
                el.parentNode.removeChild(el);
                
                
            },
        
        
        
        clearFields: function(){
            
            var fields, fieldsArr;
            
            
            //That's one below will return list -> not an array
        fields = document.querySelectorAll(DString.inDesc + ', ' + DString.inValue);
            
            //and that's the trick 
        fieldsArr = Array.prototype.slice.call(fields);
            
            
            
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
                
                
            });
            
            fieldsArr[0].focus();
            
        },
        
        
        
        disBudg: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DString.budgLabel).textContent = formNumber(obj.budget, type);
            document.querySelector(DString.incLabel).textContent = formNumber(obj.totalInc, 'inc');
            document.querySelector(DString.expLabel).textContent = formNumber(obj.totalExp,'exp');
    
            if(obj.percentage > 0){
                
                document.querySelector(DString.percLabel).textContent = obj.percentage + '%';
            } else {
                
                document.querySelector(DString.percLabel).textContent = "===";
            }
            
        },
        
        displayPerc: function(percentages){
            
            // Node List
            var fields = document.querySelectorAll(DString.expPercLabel);
            
            
            
            nodeListForEach(fields, function(curr, index){
                if(percentages[index] > 0){
                curr.textContent = percentages[index] + '%';
                } else {
                    curr.textContent = '===';
                    
                }
            });
            
        },
        
        
        disMonth: function(){
            
            var now, year, month, months;
            
         now = new Date();  
          
         months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
         month = now.getMonth();
            
         year = now.getFullYear();
         document.querySelector(DString.dateLabel).textContent = months[month] + ' / ' + year;
            
        },
        
        changedType: function(){
            
            var fields = document.querySelectorAll(
                DString.inType + ',' + DString.inDesc + ',' + DString.inValue);
                
         nodeListForEach(fields, function(curr){
             
             
             // Switch (boolean value: if(1){return 0} else {return 1});
             curr.classList.toggle('red-focus')
             
             
         });
            
        document.querySelector(DString.inBtn).classList.toggle('red');     
            
            
            
            
        },
        
        getDString: function(){
            
            return DString;
        }
        
        
    }; 
    
    
    
})();

//  GLOB CONTROLL
var controller = (function(budgCtrl, UICtrl){

    var setEveList = function(){
        
        var DOM = UICtrl.getDString();
        
         document.querySelector(DOM.inBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress', function(eve){
        
        if(eve.keyCode === 13 || eve.which === 13){
            
          ctrlAddItem();
        }
        
    });
        
    document.querySelector(DOM.trash).addEventListener('click',removeItems);

    document.querySelector(DOM.retBin).addEventListener('click', retrieveItems);
        // container is common for both inc and exp
        //  Set EventListener for event delegation
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDelItem);
        
        document.querySelector(DOM.inType).addEventListener('change', UICtrl.changedType);
        
        
        
    };
    
    var updateBudget = function(){
        
        // 1. Calculate the budget
        
        budgCtrl.calcBudg();
        
        
        // 2. Return the budget
        
        var budget = budgCtrl.getBudg();
        
        
        // 3. Display the budget on the UI
        
        UICtrl.disBudg(budget);
        
        
    };
    
    
    var updatePerc = function(){
        
        // 1. Calc the perc
        budgCtrl.calcPerc();
        
        // 2. Read them from budg controller
        var percentages = budgCtrl.getPercent();
        
        
        // 3. Update user interface
        UICtrl.displayPerc(percentages);
        
    }
    
    
    var ctrlAddItem = function(){
        
        var input, newItem;
          //   1. Get the field input data
            input = UICtrl.getinput();
            
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
           // console.log([input.type, input.value, input.description]);
            
       //   2. Add the item to the budget controller
        newItem = budgCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        
        UICtrl.addListItem(newItem, input.type);
        //4.a Clear the fields
        
        UICtrl.clearFields();
        
        // 5. Calculate and update budget
        updateBudget();
        
        //6. calc and update perc
        updatePerc();
        //7. Message information should be hidden
        document.querySelector('.mesBox').style.display = 'none';
            
        }   else {
            
            alert('Something went wrong. Enter the appropriate values!');
             UICtrl.clearFields();
        
        }
        
    };

    var removeItems = function(){

        var DOM = UICtrl.getDString();
        
        var data = budgCtrl.getBudg();
        
        //1. Remove something
        if(data.budget !== 0 || data.totalInc !== 0 ){
            
            document.querySelector(DOM.inCont).innerHTML = '';
            document.querySelector(DOM.expCont).innerHTML = '';
        //2. Update data
        
            
            budgCtrl.zeroBudg();

              //3. Update UI
             updateBudget();
             updatePerc();
             document.querySelector('.mesBox').style.display = 'block';
             var text = baffle(".mesBox");
             text.set({
             characters: '/██ <▒▒▓> █▒▓<░ ▓░▒ ░░▒▓█ ▒▒/▒ █▓░ ▒▒█▓ ▓█▒>',
             speed: 50

            });
            text.start();
            text.reveal(4000);
            
    };

};


    var retrieveItems = () => {

            let ti, ver0, ver1;
            
            // Retrieve data from sessionStorage
            const inc = [];
            const exp = [];
            const expObj = [];
            const incObj = [];
            const lit = budgCtrl.getLongest();
          
            for(let it = 0 ; it < 50; it++){

                
                ver1 = sessionStorage.getItem("inc," + it);

                if(ver1 != null && ver1 != undefined){
                inc.push("inc," + it + "," +ver1);
                let subSplit = inc[it].split(',');
                incObj.push(budgCtrl.addItem("inc", subSplit[2], parseFloat(subSplit[3])));
                
                } else {

                    inc.push(0);
                    continue;
                };
                

            };

           // console.log(incObj);
            it = 0;
            for(let it = 0 ; it < 50; it++){
               
                ver0 = sessionStorage.getItem("exp," + it)
                if(ver0 != null && ver0 != undefined){

                exp.push("exp," + it + "," + ver0);

                let subSplit = exp[it].split(',');

                expObj.push(budgCtrl.addItem("exp", subSplit[2], parseFloat(subSplit[3])));
                
                } else {

                    inc.push(0);
                    continue;
                };
                

            };
            //sessionStorage.clear();

            //Update UI
            expObj.forEach( el => {
            UICtrl.addListItem(el, "exp");
            });

            incObj.forEach( el => {
              
                UICtrl.addListItem(el, "inc");

            });

            //Update percentages and budget
            updateBudget();
            updatePerc();

       setTimeout(() => {

        document.querySelector('.mesBox').style.display = 'none';

       }, 3000);
        

    };
    
    // The magic of event delegation
    
    var ctrlDelItem = function(event){
        
        var itemID, splitID, type, ID;
        
        //target - element where the event(click) happened(was fired)
        // parentNode - traverse the DOM up and retrieve ID
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            
            splitID = itemID.split('-');    
            type = splitID[0];

            ID = parseInt(splitID[1]);
            
            // 1. Delete Item from data structure
            budgCtrl.deleteItem(type, ID);
            // 1a. Delete Item from sessionStorage
            sessionStorage.removeItem(type + ',' + ID);

            // 2. Delete Item from UI
            UICtrl.delListItem(itemID);
            // 3. Update & show the new budget
            updateBudget();
            //4. calc and update perc
            updatePerc();
            
        }
        
        
    };
    
    
   return {
       
       init: function(){
           
           console.log('Application has started.');
           UICtrl.disMonth();
           UICtrl.disBudg({
               
               budget: 0,
              totalInc: 0,
              totalExp: 0,
              percentage: -1
               
               
           });
           setEveList();
       }  
   };
    
    
})(BudControl,UIControl);


controller.init();



