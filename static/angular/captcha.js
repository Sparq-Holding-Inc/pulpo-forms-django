/**
* modulo para añadir un captcha a nuestros formularios
* Ver http://uno-de-piera.com/captcha-en-angularjs-asegura-tus-formularios/ para más información
*/
 
//modulo captcha
var captcha = angular.module('udpCaptcha', []);
 
/*
*directiva que crea un pequeño captcha para formularios
*su uso puede ser el siguiente
* <captcha field1="{{field1}}" operator="{{operator}}" field2="{{field2}}"></captcha>
*/
captcha.directive('captcha', function()
{
    return{
        restrict: 'E',
        template: 'Captcha: <span ng-model="field1">{{field1}}</span> ' +
        '<span ng-model="operator">{{operator}}</span> ' +
        '<span ng-model="field2">{{field2}}</span> = ',
        scope:
        {
          field1: "@", //variables de alcance($scope) o por valor
          field2: "@", //variables de alcance($scope) o por valor
          operator: "@" //variables de alcance($scope) o por valor
      },
      }
});
 
//nuestra factoria se llamará $captcha, inyectamos $rootScope
//devuleve un objeto con toda la funcionalidad
captcha.factory('$captcha', ['$rootScope', function ($rootScope)
{
    return {
        //obtenemos los numeros y el operador para la operación actual
        getOperation: function()
        {
            //array de operadores
            $rootScope.operators = ["+","-","*","/"];
            //obtenemos un operador aleatorio
            $rootScope.operator = $rootScope.operators[Math.floor(Math.random() * $rootScope.operators.length)];
            //numero aleatorio entre 25 y 6
            $field1 = Math.floor(Math.random() * (25 - 6) + 6);
            //si el operador es una división
            if($rootScope.operator == "/")
            {
                //obtenemos los posibles divisores del numero obtenido
                $num = this.getDivisors($field1);
                //field2 es un numero aleatorio de los posibles divisores que nos
                //ha proporcionado $num
                $field2 = $num[Math.floor(Math.random() * $num.length)];
            }
            else
            {
                //en otro caso, obtenemos un numero aleatorio
                $field2 = Math.floor((Math.random()*5)+1);
                //comprobamos que fiel1 sea mayor que field2
                while($field1 < $field2)
                {
                    $field1 = Math.floor((Math.random()*15));
                    $field2 = Math.floor((Math.random()*5)+1);
                }
            }
            //asignamos field1 y field2    
            $rootScope.field1 = $field1;
            $rootScope.field2 = $field2;
        },
 
        //obtiene los posibles numeros divisores del que hemos pasado como parametro,
        //si es 14 devuelve un array como este [1, 2, 7, 14] etc
        //fuente: http://nayuki.eigenstate.org/res/calculate-divisors-javascript.js
        getDivisors: function(n)
        {
            if (n < 1)
                n = 0;
            
            var small = [];
            var large = [];
            var end = Math.floor(Math.sqrt(n));
            for (var i = 1; i <= end; i++)
            {
                if (n % i == 0)
                {
                    small.push(i);
                    if (i * i != n)  
                        large.push(n / i);
                }
            }
            large.reverse();
            return small.concat(large);
        },
 
        //retornamos el resultado de la operación realizada
        //podriamos haber hecho un switch, pero sirve perfectamente
        getResult: function(n1,n2,operator)
        {
            if(operator == "*")
            {
                return (n1) * (n2);
            }
            else if(operator == "+")
            {
                return (n1) + (n2);
            }
            else if(operator == "/")
            {
                return (n1) / (n2);
            }
            else
            {
                return (n1) - (n2);
            }    
        },
 
        //resultado es el input que el usuario pone en el formulario
        //para responder a la operación
        checkResult: function(resultado)
        {
            //si la respuesta a la operacion es correcta
            if(parseInt(resultado) == this.getResult(parseInt($rootScope.field1),parseInt($rootScope.field2),$rootScope.operator))
            {
                return true;
            }
            //en otro caso cambiamos la operacion
            else
            {
               // this.getOperation();
            }
        }
    }
}]);
 
//mientras corra nuestro modulo lanzamos la funcion getOperation
captcha.run(function($captcha)
{
    $captcha.getOperation();
});