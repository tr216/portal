function refreshRecipeList(recipeId=''){
    if(recipeFormType!='products') return;
    var productRecipes=document.getElementById("productRecipes");
    $("#productRecipes option").remove();
    $.ajax({
        url:'/dbapi/recipes?item=' + form_item_id + '&db=' + q.db + '&sid=' + q.sid,
        type:'GET',
        success:function(result){
            if(result.success){
                if(result.data.docs!=undefined){
                    recipeList=result.data.docs;
                }else{
                    recipeList=result.data;
                }
                
                recipeList.forEach(function(e){
                    var option = document.createElement("option");
                    option.value = e._id;
                    if(e.isDefault || recipeList.length==1){
                        option.text = e.name+' ☑';
                        option.classList.add('bold');
                    }else{
                        option.text =e.name;
                    }
                    if(recipeId!='' && e._id==recipeId){
                        option.selected=true;
                    }
                    productRecipes.add(option);
                });
                var optionYeni = document.createElement("option");
                optionYeni.value = '';
                optionYeni.text = ' -- Yeni Recete --';
                productRecipes.add(optionYeni);
                productRecipesChange();
            }else{
                alert('Hata:' + result.error.message);
            }
        }
    });
}

function productRecipesChange(){
    if(recipeFormType!='products') return;
    if($('#productRecipes').val()==''){
        doc=clone(dbType.recipeType);
        if(recipeFormType=='products'){
            doc.item=form_item_id;
        }
      
        reloadRecipe();
    }else{
        $.ajax({
            url:'/dbapi/recipes/' + $('#productRecipes').val() + '?db=' + q.db + '&sid=' + q.sid,
            type:'GET',
            success:function(result){
                if(result.success){
                    doc=result.data;
                    reloadRecipe();
                }else{
                    console.log('Hata:',result.error);
                }
            }
        });
    }
}

function reloadRecipe(){
    $('#processGridTBody tr').remove();
    $('#materialSummaryGrid tr').remove();
    $('#outputSummaryGrid tr').remove();
    var processGridTBody=document.getElementById('processGridTBody');

    var materialSummaryGrid=document.getElementById('materialSummaryGrid');
    var outputSummaryGrid=document.getElementById('outputSummaryGrid');

    if(recipeFormType=='products'){
        if((doc._id || '')=='') return;

        if(doc.isDefault==true){
            $('#recipeIsDefault').prop('checked',true);
        }else{
            $('#recipeIsDefault').prop('checked',false);
        }
        $('#recipeName').val((doc.name || ''));
        $('#recipeRevision').val((doc.revision || 1));
        $('#recipeTotalQuantity').val(doc.totalQuantity);
    }else if(recipeFormType=='production-orders'){
        $('#recipeName').val((doc.recipeName || ''));
        $('#recipeRevision').val((doc.recipeRevision || 1));
        $('#recipeTotalQuantity').val(doc.plannedQuantity);
    }
    
    $('#recipeDescription').val((doc.description || ''));
    

    if(doc.process!=undefined){
        doc.process.forEach(function(e,index){
            var newRow=processGridTBody.insertRow(processGridTBody.rows.length);
            newRow.insertCell(0).innerHTML='<input type="checkbox" value="true" />';
            newRow.insertCell(1).innerHTML=(index+1).toString();
            newRow.insertCell(2).innerHTML=e.station.name;
            newRow.insertCell(3).innerHTML=e.step.name;
            var malzemeler='';
            if(e.input!=undefined){
                e.input.forEach(function(e1,index1){
                    malzemeler +=e1.item.name.value + ' ' + e1.quantity + ' ' + e1.unitCode;
                    if(index1<e.input.length-1){
                        malzemeler += '<br />';
                    }
                });
            }
            newRow.insertCell(4).innerHTML=malzemeler;
            newRow.insertCell(5).innerHTML=e.parameters;
            var cell6=newRow.insertCell(6);
            cell6.classList.add('text-center');
            cell6.innerHTML='<a href="javascript:editRecipeLine(' + index + ');" class="btn btn-primary btn-sm fas fa-edit"  title="Duzenle"></a>' +
            '<a href="javascript:removeRecipeLine(' + index + ');" class="ml-2 btn btn-danger btn-sm fas fa-trash-alt"  title="Sil"></a>';
           
        });
    }

    if(doc.materialSummary!=undefined){
        doc.materialSummary.forEach(function(e){
            var newRow=materialSummaryGrid.insertRow(materialSummaryGrid.rows.length);
            newRow.insertCell(0).innerHTML=e.item.name.value;
            newRow.insertCell(1).innerHTML=e.quantity + ' ' + e.unitCode;
        });
    }
    if(doc.outputSummary!=undefined){
        doc.outputSummary.forEach(function(e){
            var newRow=outputSummaryGrid.insertRow(outputSummaryGrid.rows.length);
            newRow.insertCell(0).innerHTML=e.item.name.value;
            newRow.insertCell(1).innerHTML=e.quantity + ' ' + e.unitCode;
        });
    }
}

function addNewRecipeLine(){
    aktifReceteAdim=-1;
    saveRecipe((err)=>{
        if(!err){
            $('#itemId').val('');
            $('#itemName').val('');
            $('#quantity').val(0);
            $('#itemIdOutput').val('');
            $('#itemNameOutput').val('');
            $('#quantityOutput').val(0);
            lineMaterialInputs=[];
            lineMaterialOutputs=[];
            refresh_materialInputGrid();
            refresh_materialOutputGrid();
            $('#recipeLineModal').modal('show');
        }else{
            alert(err.message);
        }
    });
}

function editRecipeLine(index){
    aktifReceteAdim=index;
    $('#itemId').val('');
    $('#itemName').val('');
    $('#quantity').val(0);
    $('#itemIdOutput').val('');
    $('#itemNameOutput').val('');
    $('#quantityOutput').val(0);
    saveRecipe((err)=>{
        if(!err){
            $('#station').val(doc.process[index].station._id);
            $('#processStep').val(doc.process[index].step._id);
            $('#parameters').val(doc.process[index].parameters);
            processStepChange();
            lineMaterialInputs=doc.process[index].input;
            lineMaterialOutputs=doc.process[index].output;
            refresh_materialInputGrid();
            refresh_materialOutputGrid();
            $('#recipeLineModal').modal('show');
        }else{
            alert(err.message);
        }
    });
}

function removeRecipeLine(index){
    if(confirm('Recete adimini cikarmak istiyor musunuz?')==false) return;
    if(index>-1 && index<doc.process.length){
        doc.process.splice(index,1);
    }
}

function addInputMaterial(){
    if($('#itemId').val()=='') return;
    if(Number($('#quantity').val())<=0) return;
    
    var bFound=false;
    lineMaterialInputs.forEach(function(e){
        if(e.item._id==$('#itemId').val()){
            bFound=true;
            return;
        }
    });
    if(bFound){
        alert('Bu malzeme zaten eklenmis');
        return;
    }
    var obj={
        item:{
            _id:$('#itemId').val(),
            name:{value:$('#itemName').val()},
            itemType:$('#itemType').val()
        },
        quantity:Number($('#quantity').val()),
        unitCode:'kg'
    }
    lineMaterialInputs.push(obj);
    $('#itemId').val('');
    $('#itemName').val('');
    $('#quantity').val(0);
    refresh_materialInputGrid();
    $('#itemName').focus();
}

function removeInputMaterial(index){
    if(confirm('Malzemeyi cikarmak istiyor musunuz?')==false) return;

    lineMaterialInputs.splice(index,1);
    refresh_materialInputGrid();
}
function refresh_materialInputGrid(){
    $("#materialInputGrid tr").remove();
    var materialInputGrid=document.getElementById('materialInputGrid');

    lineMaterialInputs.forEach(function(e,index){
        var newRow=materialInputGrid.insertRow(materialInputGrid.rows.length);
        //newRow.classList.add('text-nowrap');
        var itemTypeNickName='HM';
        switch(e.item.itemType){
            
            case 'raw-material': itemTypeNickName='Hammadde'; break;
            case 'helper-material': itemTypeNickName='Yardımcı Malz.'; break;
            case 'product': itemTypeNickName='Mamul'; break;
            case 'semi-product': itemTypeNickName='Yarı Mamul'; break;
            default: itemTypeNickName='Stok'; break;
        }
        var cell0=newRow.insertCell(0);
        cell0.width='20%';
        cell0.innerHTML=itemTypeNickName;

        var cell1=newRow.insertCell(1);
        cell1.width='55%';
        cell1.innerHTML=e.item.name.value;
        
        var cell2=newRow.insertCell(2);
        cell2.width='20%';
        cell2.innerHTML=e.quantity + ' ' + e.unitCode;

        var cell3=newRow.insertCell(3);
        cell3.width='60';
        cell3.innerHTML='<a href="javascript:removeInputMaterial(' + index + ');" class="btn btn-danger btn-sm fas fa-trash-alt" title="Sil"></a>';
    })
}

function addOutputMaterial(){
    if($('#itemIdOutput').val()=='') return;
    if(Number($('#quantityOutput').val())<=0) return;
    
    var bFound=false;
    lineMaterialOutputs.forEach(function(e){
        if(e.item._id==$('#itemIdOutput').val()){
            bFound=true;
            return;
        }
    });
    if(bFound){
        alert('Bu malzeme zaten eklenmis');
        return;
    }
    var obj={
        item:{
            _id:$('#itemIdOutput').val(),
            name:{value:$('#itemNameOutput').val()},
            itemType:$('#itemTypeOutput').val()
        },
        quantity:Number($('#quantityOutput').val()),
        unitCode:'kg'
    }
    lineMaterialOutputs.push(obj);
    $('#itemIdOutput').val('');
    $('#itemNameOutput').val('');
    $('#quantityOutput').val(0);
    refresh_materialOutputGrid();
    $('#itemNameOutput').focus();
}

function removeOutputMaterial(index){
    if(confirm('Malzemeyi cikarmak istiyor musunuz?')==false) return;

    lineMaterialOutputs.splice(index,1);
    refresh_materialOutputGrid();
}
function refresh_materialOutputGrid(){
    $("#materialOutputGrid tr").remove();
    var materialOutputGrid=document.getElementById('materialOutputGrid');

    lineMaterialOutputs.forEach(function(e,index){
        var newRow=materialOutputGrid.insertRow(materialOutputGrid.rows.length);
        //newRow.classList.add('text-nowrap');
        var itemTypeNickName='HM';
        
        switch(e.item.itemType){
            
            case 'raw-material': itemTypeNickName='Hammadde'; break;
            case 'helper-material': itemTypeNickName='Yardımcı Malz.'; break;
            case 'product': itemTypeNickName='Mamul'; break;
            case 'semi-product': itemTypeNickName='Yarı Mamul'; break;
            default: itemTypeNickName='Stok'; break;
        }
        var cell0=newRow.insertCell(0);
        cell0.width='20%';
        cell0.innerHTML=itemTypeNickName;

        var cell1=newRow.insertCell(1);
        cell1.width='55%';
        cell1.innerHTML=e.item.name.value;
        
        var cell2=newRow.insertCell(2);
        cell2.width='20%';
        cell2.innerHTML=e.quantity + ' ' + e.unitCode;

        var cell3=newRow.insertCell(3);
        cell3.width='60';
        cell3.innerHTML='<a href="javascript:removeOutputMaterial(' + index + ');" class="btn btn-danger btn-sm fas fa-trash-alt" title="Sil"></a>';
    })
}

function saveRecipeLine(){
    if($('#station').val()==''){
        alert('Lütfen üretim istasyonu seçiniz!');
        $('#station').focus();
        return;
    }
    if($('#processStep').val()==''){
        alert('Lütfen İşlem/Adım seçiniz!');
        $('#processStep').focus();
        return;
    }
    var obj={
        station:$('#station').val(),
        step:$('#processStep').val(),
        input:[],
        output:[],
        parameters:$('#parameters').val()
    }
    lineMaterialInputs.forEach(function(e){
        obj.input.push({item:e.item._id,quantity:e.quantity,unitCode:e.unitCode});
    });
    lineMaterialOutputs.forEach(function(e){
        obj.output.push({item:e.item._id,quantity:e.quantity,unitCode:e.unitCode});
    });
    if(aktifReceteAdim<0){
        doc.process.push(obj);
    }else{
        doc.process[aktifReceteAdim]=obj;
    }
    saveRecipe(function(err){
        if(!err){
            reloadRecipe();
            $('#recipeLineModal').modal('hide');
        }else{
            alert(err);
        }
    })
}

function itemTypeChange(){
    $('#itemName').val('');
    $('#itemId').val('');
}
function itemTypeOutputChange(){
    $('#itemNameOutput').val('');
    $('#itemIdOutput').val('');
}


function processStepChange(){

    $('.useMaterial').hide();
    stepList.forEach(function(e){
        if(e._id==$('#processStep').val()){
            if(e.useMaterial){
                $('.useMaterial').show();
            }
            return;
        }
    });
}



function saveRecipe(callback){
    if(recipeFormType=='products'){
        doc['name']=$('#recipeName').val();
        
        doc['revision']=Number($('#recipeRevision').val());
        doc['isDefault']=$('#recipeIsDefault').prop('checked');
    }
    doc['description']=$('#recipeDescription').val();
    
    var type='POST';
    var url='';
    if(recipeFormType=='products'){
        url='/dbapi/recipes?db=' + q.db + '&sid=' + q.sid;
        if(doc._id!=undefined){
            type='PUT';
            url='/dbapi/recipes/' + doc._id + '?db=' + q.db + '&sid=' + q.sid;
        }
    }else if(recipeFormType=='production-orders'){
        url='/dbapi/production-orders?db=' + q.db + '&sid=' + q.sid;
        if(doc._id!=undefined){
            type='PUT';
            url='/dbapi/production-orders/' + doc._id + '?db=' + q.db + '&sid=' + q.sid;
        }
    }
    
    
    $.ajax({
        url:url,
        data:doc,
        type:type,
        success:function(result){
            if(result.success){
                doc=result.data;
                callback(null);
            }else{
                callback(result.error);
            }
        },
        error:function(err){
            console.log(err);
        }
    });
}

function receteKaydet(){
    saveRecipe((err)=>{
        if(!err){
            refreshRecipeList((doc._id || ''));

        }
    });
}


$(document).ready(function(){
    $( "#itemName" ).keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        $( "#quantity").focus();
      }
    });
    $( "#itemNameOutput" ).keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        $( "#quantityOutput").focus();
      }
    });
    $( "#quantity" ).keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        addInputMaterial();
      }
    });
    $( "#quantityOutput" ).keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        addOutputMaterial();
      }
    });

    $('#itemName').autocomplete({
        source:function(request,response){
                var itemType=$('#itemTypeInput').val();
                $.ajax({
                url:'/dbapi/items?itemType=' + itemType + '&name=' +  encodeURIComponent(request.term) + '&db=' + q.db + '&sid=' + q.sid,
                type:'GET',
                dataType: 'json',
                success: function(result) {
                        if(result.success){
                            var dizi=[];
                            for(var i=0;i<result.data.docs.length;i++){
                                var item=result.data.docs[i];
                                
                                dizi.push({label:(item.name.value),value:item._id});
                            }
                            response(dizi);
                        }
                    },
                error:function(err){
                    console.error('err:',err);
                }
            });
        },
        select: function (event, ui) {
                $("#itemName").val(ui.item.label); 
                $("#itemId").val(ui.item.value); 
                return false;
            }
    });

    $('#itemNameOutput').autocomplete({
        source:function(request,response){
                var itemType=$('#itemTypeOutput').val();
                $.ajax({
                url:'/dbapi/items?itemType=' + itemType + '&name=' +  encodeURIComponent(request.term) + '&db=' + q.db + '&sid=' + q.sid,
                type:'GET',
                dataType: 'json',
                success: function(result) {
                        if(result.success){
                            var dizi=[];
                            for(var i=0;i<result.data.docs.length;i++){
                                var item=result.data.docs[i];
                                
                                dizi.push({label:(item.name.value),value:item._id});
                            }
                            response(dizi);
                        }
                    },
                error:function(err){
                    console.error('err:',err);
                }
            });
        },
        select: function (event, ui) {
                $("#itemNameOutput").val(ui.item.label); 
                $("#itemIdOutput").val(ui.item.value); 
                return false;
            }
    });

    refreshRecipeList();
});