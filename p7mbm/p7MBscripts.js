
/* 

  ================================================
  PVII Menu Bar Magic scripts
  Copyright (c) 2008 Project Seven Development
  www.projectseven.com
  Version:  1.1.0 - build: 1-08
  ================================================
  
*/

var p7MBi=false,p7MBa=false,p7MBctl=[],p7MBadv=[];
function P7_MBaddLoad(){
	if(window.addEventListener){
		window.addEventListener("load",P7_MBinit,false);
	}
	else if(window.attachEvent){
		window.attachEvent("onload",P7_MBinit);
	}
	else{
		window.onload=P7_MBinit;
	}
}
P7_MBaddLoad();
function P7_MBop(){
	if(!document.getElementById){
		return;
	}
	p7MBctl[p7MBctl.length]=arguments;
}
function P7_MBinit(){
	var i,j,tD,tA;
	if(p7MBi){
		return;
	}
	p7MBi=true;
	for(j=0;j<p7MBctl.length;j++){
		tD=document.getElementById(p7MBctl[j][0]);
		if(tD){
			tD.p7opt=p7MBctl[j];
			tA=tD.getElementsByTagName("a");
			for(i=0;i<tA.length;i++){
				tA[i].setAttribute("id",tD.id+'_'+(i+1));
				tA[i].parentNode.setAttribute("id",tD.id+'p_'+(i+1));
				tA[i].p7mb=tD.id;
				if(tD.p7opt[1]==1){
					tA[i].style.backgroundPosition=tD.p7opt[5]+'px '+tD.p7opt[3]+'px';
				}
				tA[i].onmouseover=function(){
					P7_MBover(this);
				};
				tA[i].onmouseout=function(){
					P7_MBout(this);
				};
				if(tD.p7opt[2]==1){
					tA[i].onmousedown=function(){
						P7_MBdown(this.id);
					};
				}
			}
			P7_MBsetFL(tA[0].parentNode.parentNode);
			if(tD.p7opt[9]==1){
				P7_MBopen(tD);
			}
		}
	}
	p7MBa=true;
}
function P7_MBover(a){
	var i,tD,op,cl;
	if(!p7MBa){
		return;
	}
	tD=document.getElementById(a.p7mb);
	op=tD.p7opt;
	cl=a.className;
	if(op[10]!=1&&cl&&cl.indexOf('p7MBmark')>-1){
		return;
	}
	if(op[1]){
		if(a.p7bga){
			clearTimeout(a.p7bga);
		}
		P7_MBslideBG(a,1);
	}
	else{
		a.style.backgroundPosition=op[6]+"px "+op[4]+"px";
	}
}
function P7_MBout(a){
	var i,tD,op,cl;
	if(!p7MBa){
		return;
	}
	tD=document.getElementById(a.p7mb);
	op=tD.p7opt;
	cl=a.className;
	if(op[10]!=1&&cl&&cl.indexOf('p7MBmark')>-1){
		return;
	}
	if(op[1]){
		if(a.p7bga){
			clearTimeout(a.p7bga);
		}
		P7_MBslideBG(a,0);
	}
	else{
		a.style.backgroundPosition=op[5]+"px "+op[3]+"px";
	}
}
function P7_MBdown(d){
	var i,a,tD,tA;
	a=document.getElementById(d);
	if(a){
		tD=document.getElementById(a.p7mb);
		tA=tD.getElementsByTagName('a');
		for(i=0;i<tA.length;i++){
			P7_MBremClass(tA[i],'p7MBmark');
		}
		P7_MBsetClass(a,'p7MBmark');
	}
}
function P7_MBmark(){
	p7MBadv[p7MBadv.length]=arguments;
}
function P7_MBopen(el){
	var j,i,k,wH,cm=false,mt=['',1,'',''],op,r1,k,kk,tA,aU;
	wH=window.location.href;
	wH=wH.replace(window.location.search,'');
	for(k=0;k<p7MBadv.length;k++){
		if(p7MBadv[k][0]&&p7MBadv[k][0]==el.id){
			mt=p7MBadv[k];
			cm=true;
			break;
		}
	}
	op=mt[1];
	if(op<1){
		return;
	}
	r1=/index\.[\S]*/i;
	k=-1,kk=-1;
	tA=el.getElementsByTagName("A");
	for(j=0;j<tA.length;j++){
		aU=tA[j].href.replace(r1,'');
		if(op>0){
			if(tA[j].href==wH||aU==wH){
				k=j;
				kk=-1;
				break;
			}
		}
		if(op==2){
			if(tA[j].firstChild){
				if(tA[j].firstChild.nodeValue==mt[2]){
					kk=j;
				}
			}
		}
		if(op==3&&tA[j].href.indexOf(mt[2])>-1){
			kk=j;
		}
		if(op==4){
			for(x=2;x<mt.length;x+=2){
				if(wH.indexOf(mt[x])>-1){
					if(tA[j].firstChild&&tA[j].firstChild.nodeValue){
						if(tA[j].firstChild.nodeValue==mt[x+1]){
							kk=j;
						}
					}
				}
			}
		}
	}
	k=(kk>k)?kk:k;
	if(k>-1){
		P7_MBdown(tA[k].id);
	}
}
function P7_MBslideBG(el,md){
	var i,tD,op,cp,tl,tt,du,dl,dt,ds,st,fr,dy=10;
	tD=document.getElementById(el.p7mb);
	op=tD.p7opt;
	cp=P7_MBgetBG(el);
	if(md==1){
		tl=op[6];
		tt=op[4];
		du=op[7];
	}
	else{
		tl=op[5];
		tt=op[3];
		du=op[8];
	}
	dl=Math.abs(Math.abs(tl)-Math.abs(cp[0]));
	dt=Math.abs(Math.abs(tt)-Math.abs(cp[1]));
	ds=(dl>=dt)?dl:dt;
	st=du/dy;
	fr=parseInt(ds/st);
	fr=(fr<1)?1:fr;
	P7_MBglideBG(el.id,cp[0],tl,cp[1],tt,fr,dy);
}
function P7_MBglideBG(id,x,tl,y,tt,fr,dy){
	var el,nt,nl,m=false;
	el=document.getElementById(id);
	if(y!=tt){
		if(tt<y){
			nt=y-fr;
			nt=(nt<=tt)?tt:nt;
		}
		else{
			nt=y+fr;
			nt=(nt>=tt)?tt:nt;
		}
		m=true;
	}
	else{
		nt=y;
	}
	if(x!=tl){
		if(tl<x){
			nl=x-fr;
			nl=(nl<=tl)?tl:nl;
		}
		else{
			nl=x+fr;
			nl=(nl>=tl)?tl:nl;
		}
		m=true;
	}
	else{
		nl=x;
	}
	if(m){
		if(el.p7bga){
			clearTimeout(el.p7bga);
		}
		el.style.backgroundPosition=nl+"px "+nt+"px";
		el.p7bga=setTimeout("P7_MBglideBG('"+el.id+"',"+nl+","+tl+","+nt+","+tt+","+fr+","+dy+")",dy);
	}
}
function P7_MBgetBG(el){
	var bg,ba,x,y,nx=0,ny=0;
	bg=el.style.backgroundPosition;
	if(!bg){
		if(el.currentStyle){
			bg=el.currentStyle.backgroundPosition;
			if(!bg){
				x=el.currentStyle.backgroundPositionX;
				y=el.currentStyle.backgroundPositionY;
				bg=x+' '+y;
			}
		}
		else if(document.defaultView.getComputedStyle(el,"")){
			bg=document.defaultView.getComputedStyle(el,"").getPropertyValue('background-position');
		}
	}
	ba=bg.split(' ');
	if(ba&&ba[0]){
		nx=parseInt(ba[0]);
		if(ba[1]){
			ny=parseInt(ba[1]);
		}
	}
	nx=(nx)?nx:0;
	ny=(ny)?ny:0;
	return [nx,ny];
}
function P7_MBsetFL(el){
	var i,pt,ob,a;
	pt=P7_MBgetFL(el,'LI');
	if(pt[0]>-1){
		ob=el.childNodes[pt[0]];
		P7_MBsetClass(ob,'p7MBfirst');
		a=ob.getElementsByTagName('a');
		if(a&&a[0]){
			P7_MBsetClass(a[0],'p7MBfirst');
		}
	}
	if(pt[1]>-1){
		ob=el.childNodes[pt[1]];
		P7_MBsetClass(ob,'p7MBlast');
		a=ob.getElementsByTagName('a');
		if(a&&a[0]){
			P7_MBsetClass(a[0],'p7MBlast');
		}
	}
}
function P7_MBgetFL(nD,tp){
	var i,tC,a=-1,b=-1,rr=[];
	tC=nD.childNodes;
	for(i=0;i<tC.length;i++){
		if(tC[i].nodeName==tp){
			if(a<0){
				a=i;
			}
			else{
				b=i;
			}
		}
	}
	rr[0]=a;
	rr[1]=b
	return rr;
}
function P7_MBsetClass(ob,cl){
	var cc,nc,r=/\s+/g;
	cc=ob.className;
	nc=cl;
	if(cc&&cc.length>0){
		nc=cc+' '+cl;
	}
	nc=nc.replace(r,' ');
	ob.className=nc;
}
function P7_MBremClass(ob,cl){
	var cc,nc,r=/\s+/g;;
	cc=ob.className;
	if(cc&&cc.indexOf(cl>-1)){
		nc=cc.replace(cl,'');
		nc=nc.replace(r,' ');
		ob.className=nc;
	}
}
