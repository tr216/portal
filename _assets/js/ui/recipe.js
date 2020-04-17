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


function saveRecipe(callback){
    if(recipeFormType=='products'){
        doc['name']=$('#recipeName').val();
        
        doc['revision']=Number($('#recipeRevision').val());
        doc['isDefault']=$('#recipeIsDefault').prop('checked');
    }
    doc['description']=$('#recipeDescription').val();
    
    if(doc.process.length>0){
        doc.process.forEach(function(p){
            stepList.forEach(function(e){
                if(e._id==p.step._id){
                    if(e.useMaterialInput==false) p.input=[];
                    if(e.useMaterialOutput==false) p.output=[];
                    if(e.useMachine==false && e.useMold==false) p.machines=[];
                    if(e.useParameters==false) p.parameters='';
                    return;
                }
            })
        });
    }
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


function reloadRecipe(onlyProcess=false){
    $('#processGrid').html('');

    // var processGrid=document.getElementById('processGrid');

    if(onlyProcess==false){
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
    }

    if(doc.process!=undefined){
        if(doc.process.length==0){
            yeniProcess();
        }else{
            doc.process.forEach(function(e,index){
                yeniProcess(e);
            });
        }
    }else{
        yeniProcess();
    }
   
}

function yeniProcess(process=undefined){
    if(process==undefined){
      
        var newProcess=clone(dbType.recipeProcessType);
        doc.process.push(newProcess);
        yeniProcess(newProcess);
        return;
    }
    var adim=document.getElementById('sablonAdim').cloneNode(true);
    var index=document.getElementById('processGrid').childNodes.length;
    
    adim.id='adim' + index;
    adim.style.display="inherit";
    document.getElementById('processGrid').appendChild(adim);

    $('#' + adim.id + ' #baslik').html('Adım #' + (index+1).toString());
    
    adim.querySelector('#addProcessMachineButton').href='javascript:addProcessMachine(' + index + ');';
    if(recipeFormType=='products'){
        adim.querySelector('#addProcessInputMaterialButton').href='javascript:addProcessInputMaterial(' + index + ');';
        adim.querySelector('#addProcessOutputMaterialButton').href='javascript:addProcessOutputMaterial(' + index + ');';
        
        adim.querySelector('#silProcessButton').href='javascript:silProcess(' + index + ');';

        // if(index==0){
        //     adim.querySelector('#silProcessButton').style.display='none';
        // }
    }else if(recipeFormType=='production-orders'){
        adim.querySelector('#addProcessInputMaterialRow').style.display='none';
        adim.querySelector('#addProcessOutputMaterialRow').style.display='none';
        // adim.querySelector('#addProcessMachineRow').style.display='none';
        adim.querySelector('#silProcessButton').style.display='none';
        adim.querySelector('#yeniProcessButton').style.display='none';
        
    }

    autoCompleteItemName(index);
    

    if(process.station) $('#' + adim.id + ' #station').val(process.station._id);
    if(process.step) $('#' + adim.id + ' #processStep').val(process.step._id);
    if(process.step)
        processAdimDegistir(index,process.step._id);
    else
        processAdimDegistir(index,'');
    $('#' + adim.id + ' #processNotlar').val(process.parameters);
    refreshProcessInputMaterialGrid(index);
    refreshProcessOutputMaterialGrid(index);
    refreshProcessMachines(index);
}

function silProcess(adimIndex){
    if(doc.process.length==1) return;
    if(!confirm('Adim #' + (adimIndex + 1).toString() + ' silmek istediginizden emin misiniz?')) return;
    doc.process.splice(adimIndex,1);
    reloadRecipe(true);
}

function refreshProcessInputMaterialGrid(adimIndex){
    var adimDiv=document.getElementById('adim' + adimIndex);
    var malzemeGrid=adimDiv.querySelector('#malzemeGrid');
    var c=malzemeGrid.rows.length;
    
    for(var i=0;i<c-1;i++){
        malzemeGrid.rows[0].remove();
    }
    if(!doc.process[adimIndex]) return;

    if(doc.process[adimIndex].input==undefined) doc.process[adimIndex].input=[];
    var toplamOran=0;
    var receteMiktari=0;
    if(recipeFormType=='products') receteMiktari=doc.totalQuantity;

    doc.process[adimIndex].input.forEach(function(e,index2){

        var newRow=malzemeGrid.insertRow(malzemeGrid.rows.length-1);
        var cell0=newRow.insertCell(0);
        cell0.innerHTML=e.item.name.value;

        var cell1=newRow.insertCell(1);
        cell1.classList.add('text-right');

        var oran=0;
        if(defaultUnit.netWeight.attr.unitCode==e.unitCode){
            if(receteMiktari*defaultUnit.netWeight.value>0){
                oran=Math.round(100*100*e.quantity/(receteMiktari*defaultUnit.netWeight.value))/100;
            }
            
            cell1.innerHTML='%' + oran;
            toplamOran +=Math.round(100*oran)/100;
        }else{
            cell1.innerHTML='';
        }
        

        var cell2=newRow.insertCell(2);
        cell2.classList.add('text-right');
        cell2.innerHTML=e.quantity + ' ' + getUnitCodeText(e.unitCode);

        var cell3=newRow.insertCell(3);
        cell3.classList.add('text-center');
        if(recipeFormType=='products'){
            cell3.innerHTML='<a href="javascript:removeProcessInputMaterial(' + adimIndex + ',' + index2 + ');" class="btn btn-danger fas fa-trash-alt"  title="sil"></a>';    
        }else{
            cell3.innerHTML='';
        }
       
    });

    if(recipeFormType=='products'){
        adimDiv.querySelector('#totalPercentInput').innerHTML='%' + toplamOran.formatMoney();
        
    }
   
}

function removeProcessInputMaterial(adimIndex,rowIndex){
    if(!confirm('Malzemeyi silmek istiyor musunuz?')) return;
    if(doc.process[adimIndex].input){
        doc.process[adimIndex].input.splice(rowIndex,1);
        refreshProcessInputMaterialGrid(adimIndex);
    }
}

function addProcessInputMaterial(adimIndex){
    
    var itemId=$('#adim'+ adimIndex + ' #itemId').val();
    var itemName=$('#adim'+ adimIndex + ' #itemName').val();
    var unitCode=$('#adim'+ adimIndex + ' #quantity-unitCode').val();
    var quantity=Number($('#adim'+ adimIndex + ' #quantity').val());
    
    if(!(itemId && quantity>0)) return;
    if(!doc.process[adimIndex].input) doc.process[adimIndex].input=[];
    doc.process[adimIndex].input.push({item:{_id:itemId,name:{value:itemName}},quantity:quantity,unitCode:unitCode});
    $('#adim'+ adimIndex + ' #itemId').val('');
    $('#adim'+ adimIndex + ' #itemName').val('');
    $('#adim'+ adimIndex + ' #quantity').val(0);
    refreshProcessInputMaterialGrid(adimIndex);
    $('#adim'+ adimIndex + ' #itemName').focus();
}

// output material
function refreshProcessOutputMaterialGrid(adimIndex){
    var adimDiv=document.getElementById('adim' + adimIndex);
    var malzemeGridOutput=adimDiv.querySelector('#malzemeGridOutput');
    var c=malzemeGridOutput.rows.length;
    
    for(var i=0;i<c-1;i++){
        malzemeGridOutput.rows[0].remove();
    }
    if(!doc.process[adimIndex]) return;

    if(doc.process[adimIndex].output==undefined) doc.process[adimIndex].output=[];
    
    doc.process[adimIndex].output.forEach(function(e,index2){
        var newRow=malzemeGridOutput.insertRow(malzemeGridOutput.rows.length-1);
        var cell0=newRow.insertCell(0);
        cell0.innerHTML=e.item.name.value;

        var cell1=newRow.insertCell(1);
        cell1.classList.add('text-right');
        cell1.innerHTML=e.quantity + ' ' + e.unitCode;

        var cell2=newRow.insertCell(2);
        cell2.classList.add('text-center');
        if(recipeFormType=='products'){
            cell2.innerHTML='<a href="javascript:removeProcessOutputMaterial(' + adimIndex + ',' + index2 + ');" class="btn btn-danger fas fa-trash-alt"  title="sil"></a>';
        }else{
            cell2.innerHTML='';
        }
    });
    
}

function removeProcessOutputMaterial(adimIndex,rowIndex){
    if(!confirm('Yan urunu silmek istiyor musunuz?')) return;
    if(doc.process[adimIndex].output){
        doc.process[adimIndex].output.splice(rowIndex,1);
        refreshProcessOutputMaterialGrid(adimIndex);
    }
}

function addProcessOutputMaterial(adimIndex){
    
    var itemId=$('#adim'+ adimIndex + ' #itemIdOutput').val();
    var itemName=$('#adim'+ adimIndex + ' #itemNameOutput').val();
    var unitCode=$('#adim'+ adimIndex + ' #quantity-unitCodeOutput').val();
    var quantity=Number($('#adim'+ adimIndex + ' #quantityOutput').val());
    
    if(!(itemId && quantity>0)) return;
    if(!doc.process[adimIndex].output) doc.process[adimIndex].output=[];
    doc.process[adimIndex].output.push({item:{_id:itemId,name:{value:itemName}},quantity:quantity,unitCode:unitCode});
    $('#adim'+ adimIndex + ' #itemIdOutput').val('');
    $('#adim'+ adimIndex + ' #itemNameOutput').val('');
    $('#adim'+ adimIndex + ' #quantityOutput').val(0);
    refreshProcessOutputMaterialGrid(adimIndex);
    $('#adim'+ adimIndex + ' #itemNameOutput').focus();
}


function refreshProcessMachines(adimIndex){
    var adimDiv=document.getElementById('adim' + adimIndex);
    var machineGrid=adimDiv.querySelector('#machineGrid');
    var c=machineGrid.rows.length;
    
    for(var i=0;i<c-1;i++){
        machineGrid.rows[0].remove();
    }
    
    if(!doc.process[adimIndex]) return;

    if(doc.process[adimIndex].machines==undefined) doc.process[adimIndex].machines=[];
    
    doc.process[adimIndex].machines.forEach(function(e,index2){
        var newRow=machineGrid.insertRow(machineGrid.rows.length-1);
        var cell0=newRow.insertCell(0);
        cell0.innerHTML='';
        if(recipeFormType=='products'){
            if(e.machineGroup) cell0.innerHTML=e.machineGroup.name;
        }else{
            if(e.machine) cell0.innerHTML=e.machine.name;
        }
        

        var cell1=newRow.insertCell(1);
        cell1.innerHTML='';
        if(e.mold) cell1.innerHTML=e.mold.name;

        var cell2=newRow.insertCell(2);
        cell2.classList.add('text-right');
        cell2.innerHTML=e.cavity;

        var cell3=newRow.insertCell(3);
        cell3.classList.add('text-right');

        cell3.innerHTML=e.cycle.value + ' ' + getUnitCodeText(e.cycle.attr.unitCode) + '/birim';

        var cell4=newRow.insertCell(4);
        cell4.classList.add('text-right');
        cell4.innerHTML=e.quantityPerHour;

        var cell5=newRow.insertCell(5);
        cell5.classList.add('text-center');
        cell5.innerHTML='<a href="javascript:removeProcessMachine(' + adimIndex + ',' + index2 + ');" class="btn btn-danger fas fa-trash-alt" title="sil"></a>';

    });
    
}

function removeProcessMachine(adimIndex,rowIndex){
    if(!confirm('Makine/Kalıp tanımını silmek istiyor musunuz?')) return;
    if(doc.process[adimIndex].machines){
        doc.process[adimIndex].machines.splice(rowIndex,1);
        refreshProcessMachines(adimIndex);
    }
}

function addProcessMachine(adimIndex){
    
    var machineGroup=$('#adim'+ adimIndex + ' #select-machine').val();
    var machineGroupName=$('#adim'+ adimIndex + ' #select-machine option:selected').text();
    var mold=$('#adim'+ adimIndex + ' #select-mold').val();
    var moldName=$('#adim'+ adimIndex + ' #select-mold option:selected').text();
    var cavity=Number($('#adim'+ adimIndex + ' #cavity').val());
    var cycle=Number($('#adim'+ adimIndex + ' #cycle').val());
    var cycleUnitCode=$('#adim'+ adimIndex + ' #cycle-unitCode').val();
    
    if(!(machineGroup || mold)) return;
    if(!doc.process[adimIndex].machines) doc.process[adimIndex].machines=[];

    var bFound=false;
    doc.process[adimIndex].machines.forEach(function(e){
        if(mold==e.mold._id){
            if(recipeFormType=='products'){
                if(machineGroup==e.machineGroup._id){
                    bFound=true;
                    return;
                }
            }else if(recipeFormType=='production-orders'){
                if(machineGroup==e.machine._id){
                    bFound=true;
                    return;
                }
            }
        }
    });
    if(bFound){
        return alert('Daha onceden eklenmis!');
    }
    var makine={
        mold:{
            _id:mold,
            name:moldName
        },
        cavity:cavity,
        cycle:{value:cycle,attr:{unitCode:cycleUnitCode}},
        quantityPerHour:0
    }
    if(recipeFormType=='products'){
        makine['machineGroup']={
            _id:machineGroup,
            name:machineGroupName
        }
    }else if(recipeFormType=='production-orders'){
        makine['machine']={
            _id:machineGroup,
            name:machineGroupName
        }
    }
    if(makine.cycle.attr.unitCode=='D62'){  //saniye
        if(makine.cycle.value>0){
            makine.quantityPerHour=Math.round(100*makine.cavity*3600/makine.cycle.value)/100;
        }
    }else if(makine.cycle.attr.unitCode=='D61'){  //dakika
        if(makine.cycle.value>0){
            makine.quantityPerHour=Math.round(100*makine.cavity*60/makine.cycle.value)/100;
        }
    }

    doc.process[adimIndex].machines.push(makine);

    if($('#adim'+ adimIndex + ' #select-machine option').length>1){
        $('#adim'+ adimIndex + ' #select-machine').val('');
    }
    if($('#adim'+ adimIndex + ' #select-mold option').length>1){
        $('#adim'+ adimIndex + ' #select-mold').val('');
    }
    
    $('#adim'+ adimIndex + ' #cavity').val(1)
    $('#adim'+ adimIndex + ' #cycle').val(0)
    refreshProcessMachines(adimIndex);
}

function processAdimDegistir(adimIndex,deger){
    //alert('adimIndex:' + adimIndex + '  degeri:' + deger);
    var adimDiv=document.getElementById('adim'+adimIndex);

    stepList.forEach(function(e){
        if(e._id==deger){
            
            if(e.useMaterialInput){
                adimDiv.querySelector('#useMaterialInput').style.display='inherit';
            }else{
                adimDiv.querySelector('#useMaterialInput').style.display='none';
            }
            if(e.useMaterialOutput){
                adimDiv.querySelector('#useMaterialOutput').style.display='inherit';
            }else{
                adimDiv.querySelector('#useMaterialOutput').style.display='none';
            }

            if(e.useMachine || e.useMold){
                adimDiv.querySelector('#useMachineOrMold').style.display='inherit';
            }else{
                adimDiv.querySelector('#useMachineOrMold').style.display='none';
            }

            if(e.useParameters){
                adimDiv.querySelector('#useParameters').style.display='inherit';
            }else{
                adimDiv.querySelector('#useParameters').style.display='none';
            }
            doc.process[adimIndex].step={_id:e._id,name:e.name};
            return;
        }
    });
}

var machineList=[];

function autoCompleteItemName(adimIndex){
    var adimDiv=document.getElementById('adim' + adimIndex);

    $('#adim' + adimIndex + ' #itemName').autocomplete({
        source:function(request,response){
                var itemType=$('#adim' + adimIndex + ' #itemTypeInput').val();
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
                $('#adim' + adimIndex + ' #itemName').val(ui.item.label); 
                $('#adim' + adimIndex + ' #itemId').val(ui.item.value); 
                return false;
            }
    });

    $('#adim' + adimIndex + ' #itemName' ).keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        $( '#adim' + adimIndex + ' #percent').focus();
        $( '#adim' + adimIndex + ' #percent').select();
      }
    });
    $('#adim' + adimIndex + ' #percent').change(function() {
        var oran=Number($('#adim' + adimIndex + ' #percent').val());
        var receteMiktari=doc.totalQuantity * defaultUnit.netWeight.value;
        var miktar=Math.round(100*receteMiktari*oran/100)/100;
        $('#adim' + adimIndex + ' #quantity').val(miktar);

    });
    $('#adim' + adimIndex + ' #percent').keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        $( '#adim' + adimIndex + ' #quantity').focus();
        $( '#adim' + adimIndex + ' #quantity').select();
      }
    });
    $('#adim' + adimIndex + ' #quantity').keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        addProcessInputMaterial(adimIndex);
      }
    });

    $('#adim' + adimIndex + ' #itemNameOutput').autocomplete({
        source:function(request,response){
                var itemType=$('#adim' + adimIndex + ' #itemTypeOutput').val();
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
                $('#adim' + adimIndex + ' #itemNameOutput').val(ui.item.label); 
                $('#adim' + adimIndex + ' #itemIdOutput').val(ui.item.value); 
                return false;
            }
    });

    $('#adim' + adimIndex + ' #itemNameOutput' ).keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        $( '#adim' + adimIndex + ' #quantityOutput').focus();
        $( '#adim' + adimIndex + ' #quantityOutput').select();
      }
    });
    $('#adim' + adimIndex + ' #quantityOutput').keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
        addProcessOutputMaterial(adimIndex);
      }
    });

    $('#adim' + adimIndex + ' #station').change(function() {
        doc.process[adimIndex].station={
            _id:$( '#adim' + adimIndex + ' #station').val(),
            name:$( '#adim' + adimIndex + ' #station option:selected').text()
        }
    });

    $('#adim' + adimIndex + ' #processStep').change(function() {
        processAdimDegistir(adimIndex,$( '#adim' + adimIndex + ' #processStep').val());
    });
    
    $('#adim' + adimIndex + ' #select-machine').change(function() {
        selectMachineChange(adimIndex,$( '#adim' + adimIndex + ' #select-machine').val());
    });

    $('#adim' + adimIndex + ' #select-mold').change(function() {
        selectMoldChange(adimIndex,$( '#adim' + adimIndex + ' #select-mold').val());
    });

    $('#adim' + adimIndex + ' #processNotlar').change(function() {
        doc.process[adimIndex].parameters=$('#adim' + adimIndex + ' #processNotlar').val();
    });
    
    var url='';
    if(recipeFormType=='products'){
        url='/dbapi/mrp-machine-groups?db=' + q.db + '&sid=' + q.sid;
    }else if(recipeFormType=='production-orders'){
        url='/dbapi/mrp-machines?recipe=' + doc.sourceRecipe + '&processIndex=' + adimIndex + '&db=' + q.db + '&sid=' + q.sid;
    }

    $.ajax({
        url:url,
        type:'GET',
        success:function(result){
            if(result.success){
                
                if(result.data.docs.length>1){
                    var optionYeni = document.createElement("option");
                    optionYeni.value = '';
                    optionYeni.text = '-- Seç --';
                    adimDiv.querySelector('#select-machine').add(optionYeni);
                }
               
                result.data.docs.forEach(function(e){
                    var option = document.createElement("option");
                    option.value = e._id;
                    
                    
                    option.text = e.name;
                    adimDiv.querySelector('#select-machine').add(option);
                    if(recipeFormType=='production-orders'){
                        machineList.push(e);
                    }
                });
                selectMachineChange(adimIndex,$( '#adim' + adimIndex + ' #select-machine').val());
               
            }else{
                alert('Hata:' + result.error.message);
            }
        }
    });
}

function selectMachineChange(adimIndex,deger){
    console.log('selectMachineChange => adimIndex:',adimIndex,' deger:',deger);
    var adimDiv=document.getElementById('adim' + adimIndex);
    $('#adim' + adimIndex + ' #select-mold option').remove();

    
    if(deger=='') return;



    var url='';
    if(recipeFormType=='products'){
        url='/dbapi/mrp-molds?machineGroup=' + deger + '&db=' + q.db + '&sid=' + q.sid;
    }else if(recipeFormType=='production-orders'){
        var machineGroup='---';
        machineList.forEach(function(e){
            if(e._id==deger){
                machineGroup=e.machineGroup;
                return;
            }
        })
        url='/dbapi/mrp-molds?machineGroup=' + machineGroup + '&recipe=' + doc.sourceRecipe + '&db=' + q.db + '&sid=' + q.sid;
    }

    $.ajax({
        url:url,
        type:'GET',
        success:function(result){
            if(result.success){
                if(result.data.docs.length>0){
                    if(result.data.docs.length>1){
                        var optionYeni = document.createElement("option");
                        optionYeni.value = '';
                        optionYeni.text = '-- Seç --';
                        adimDiv.querySelector('#select-mold').add(optionYeni);
                    }
                    result.data.docs.forEach(function(e){
                        var option = document.createElement("option");
                        option.value = e._id;
                        option.text = e.name;
                        adimDiv.querySelector('#select-mold').add(option);
                    });
                    selectMoldChange(adimIndex,$( '#adim' + adimIndex + ' #select-mold').val());
                }
            }else{
                alert('Hata:' + result.error.message);
            }
        }
    });
}

function selectMoldChange(adimIndex,deger){
    if(recipeFormType!='production-orders') return;
    if(sourceRecipeDoc==undefined) return;
    if(adimIndex>sourceRecipeDoc.process.length-1) return;
        
    if(deger=='') return;

    var machineGroup='';

    machineList.forEach(function(e){
        if(e._id==$('#adim' + adimIndex + ' #select-machine').val()){
            machineGroup=e.machineGroup;
            return;
        }
    })
    var cavity=1;
    var cycle=0;
    var cycleUnitCode='D62';
    sourceRecipeDoc.process[adimIndex].machines.forEach(function(e){
        if(machineGroup==e.machineGroup._id && deger==e.mold._id){
            cavity=e.cavity;
            cycle=e.cycle.value;
            cycleUnitCode=e.cycle.attr.unitCode;
            return;
        }
    })
    $('#adim' + adimIndex + ' #cavity').val(cavity);
    $('#adim' + adimIndex + ' #cycle').val(cycle);
    $('#adim' + adimIndex + ' #cycle-unitCode').val(cycleUnitCode);
}


$(document).ready(function(){

    

    

    refreshRecipeList();
});