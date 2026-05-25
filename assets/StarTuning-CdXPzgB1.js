var ae=Object.defineProperty;var se=(t,e,a)=>e in t?ae(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var f=(t,e,a)=>se(t,typeof e!="symbol"?e+"":e,a);import{ad as o,g as D,a2 as A,N as I,B as N,a3 as U,w as T,a1 as P,Q as O,ae as G,ab as k,X as V,s as R,S as W,ac as ie}from"./three.module-DyEahhvZ.js";const X=new o(58e-7,135e-7,301e-7),E=new o(3e-6,5e-6,8e-6),L=new o(8e-6,18e-6,3e-5),ne=new o(2e-6,4e-6,3e-6),Y=new o(4e-5,2e-5,1e-5),K=new o(3e-6,2e-6,1e-6),z=new o(2e-6,2e-6,2e-6),$=new o(1e-6,25e-7,4e-8),M=new o(0,0,0),q={EARTH_LIKE:{betaRayleigh:X.clone(),betaMie:z.clone().multiplyScalar(.3),betaOzone:$.clone(),scaleHeight:.06,atmosphereDensity:1,mieG:.76,dustDensity:0},THIN:{betaRayleigh:E.clone().multiplyScalar(.3),betaMie:Y.clone().multiplyScalar(.8),betaOzone:M.clone(),scaleHeight:.08,atmosphereDensity:.15,mieG:.65,dustDensity:.4},THICK:{betaRayleigh:E.clone().multiplyScalar(2),betaMie:new o(5e-6,5e-6,5e-6),betaOzone:M.clone(),scaleHeight:.04,atmosphereDensity:3,mieG:.8,dustDensity:0},GAS_GIANT:{betaRayleigh:L.clone(),betaMie:z.clone().multiplyScalar(.2),betaOzone:M.clone(),scaleHeight:.05,atmosphereDensity:2,mieG:.7,dustDensity:0},ICE_GIANT:{betaRayleigh:L.clone().multiplyScalar(.8),betaMie:K.clone().multiplyScalar(.5),betaOzone:M.clone(),scaleHeight:.05,atmosphereDensity:1.5,mieG:.72,dustDensity:0},NONE:{betaRayleigh:new o(0,0,0),betaMie:new o(0,0,0),betaOzone:M.clone(),scaleHeight:0,atmosphereDensity:0,mieG:0,dustDensity:0}};function oe(t,e){if(!t)return q[e||"NONE"]||q.NONE;const a=(t.N2||0)+(t.O2||0),s=t.CO2||0,i=(t.H2||0)+(t.He||0),n=t.CH4||0,m=t.H2O||0,l=t.surfacePressure??1,c=new o(0,0,0);c.addScaledVector(X,a),c.addScaledVector(E,s),c.addScaledVector(L,i),c.addScaledVector(ne,n);const h=l<=10?l:10*Math.sqrt(l/10);c.multiplyScalar(h);const u=new o(0,0,0);let p=0;s>.5&&l<.1&&(u.addScaledVector(Y,1.5),p=.4),n>.01&&u.addScaledVector(K,n*20),m>.005&&u.addScaledVector(z,m*10),l>5&&u.addScaledVector(new o(3e-6,3e-6,3e-6),Math.min(l/30,3));const g=Math.min(h,40),x=t.O2||0,S=x>.05?$.clone().multiplyScalar(x/.21):M.clone();return{betaRayleigh:c,betaMie:u,betaOzone:S,scaleHeight:i>.5?.05:.06,atmosphereDensity:g,mieG:n>.01?.6:.76,dustDensity:p}}function B(t){const e=Math.max(t.betaMie.x,t.betaMie.y,t.betaMie.z),a=Math.max(t.betaRayleigh.x+t.betaMie.x,t.betaRayleigh.y+t.betaMie.y,t.betaRayleigh.z+t.betaMie.z);if(a<1e-10)return 1;const s=e/a;return 1/(1+20*s*s)}function pe(t){const{betaRayleigh:e,betaMie:a}=t,s=e.clone().add(a),i=Math.max(s.x,s.y,s.z,1e-10);return new D(Math.sqrt(s.x/i),Math.sqrt(s.y/i),Math.sqrt(s.z/i))}function ye(t){const e=Math.max(1e3,Math.min(4e4,t)),a=e/100;let s,i,n;e<=6600?s=1:s=1.29*Math.pow(a-66,-.1332),e<=6600?i=.39*Math.log(a)-.634:i=1.13*Math.pow(a-66,-.0755),e>=6600?n=1:e<=1900?n=0:n=.543*Math.log(a-10)-1.19,s=Math.max(0,Math.min(1,s)),i=Math.max(0,Math.min(1,i)),n=Math.max(0,Math.min(1,n));const l=5778/100,c=1,h=Math.max(0,Math.min(1,.39*Math.log(l)-.634)),u=Math.max(0,Math.min(1,.543*Math.log(l-10)-1.19));return new o(s/c,h>0?i/h:i,u>0?n/u:n)}const F={uniforms:{uSunDirection:{value:new o(0,1,0)},uSunColor:{value:new o(1,1,1)},uBetaRayleigh:{value:new o(58e-7,135e-7,301e-7)},uBetaMie:{value:new o(2e-6,2e-6,2e-6)},uBetaOzone:{value:new o(0,0,0)}},vertexShader:`
    varying vec3 vWorldDir;

    void main() {
      // Inverted sphere: position IS the view direction from center
      vWorldDir = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform vec3 uSunDirection;
    uniform float uSunIntensity;
    uniform vec3 uSunColor;
    uniform vec3 uBetaRayleigh;
    uniform vec3 uBetaMie;
    uniform vec3 uBetaOzone;
    uniform float uAtmDensity;
    uniform float uMieG;
    uniform float uDustDensity;
    uniform float uExposure;

    varying vec3 vWorldDir;

    // Rayleigh phase function: (3/16pi)(1 + cos^2(theta))
    float rayleighPhase(float cosTheta) {
      return 0.05968 * (1.0 + cosTheta * cosTheta); // 3/(16*pi)
    }

    // Henyey-Greenstein phase function for Mie scattering
    float miePhase(float cosTheta, float g) {
      float g2 = g * g;
      float num = (1.0 - g2);
      float denom = pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
      return 0.07958 * num / denom; // 1/(4*pi)
    }

    void main() {
      vec3 viewDir = normalize(vWorldDir);

      // View altitude (angle above horizon, y=up in local frame)
      float altitude = asin(viewDir.y);

      // Below horizon: fade to transparent so ground shows through.
      // For thick atmospheres (high density), haze fills the full sphere --
      // looking down on Venus you see opaque haze, not space.
      float horizonBase = smoothstep(-0.0175, 0.0, altitude);
      float thickHaze = clamp((uAtmDensity - 1.0) / 4.0, 0.0, 1.0);
      float horizonFade = mix(horizonBase, 1.0, thickHaze);

      // Scattering angle between view direction and sun
      float cosTheta = dot(viewDir, uSunDirection);
      float phaseR = rayleighPhase(cosTheta);
      float phaseM = miePhase(cosTheta, uMieG);

      // Multiple scattering approximation for dusty atmospheres:
      // Dust re-scatters light isotropically after initial forward Mie scatter.
      // On Mars (dustDensity ~0.4), this fills the sky with diffuse butterscotch
      // color instead of a tight aureole. On Earth (dustDensity=0), no-op.
      float dustMultiScatter = uDustDensity * 0.2;

      // Beer-Lambert transmittance
      vec3 totalBeta = uBetaRayleigh + uBetaMie;
      // Ozone is pure absorption (no scattering), adds to extinction only
      vec3 extinctionBeta = totalBeta + uBetaOzone;

      // PATH_SCALE calibrated so Earth (density=1, beta_blue=30.1e-6)
      // gives zenith tau_blue ~0.29, matching measured Rayleigh OD at 440nm.
      // OD caps use totalBeta (scattering only) -- ozone is a small absorption
      // correction, not a driver of the numerical stability caps.
      float maxBeta = max(totalBeta.r, max(totalBeta.g, totalBeta.b));
      float viewODCap = 12.0 / max(maxBeta, 1e-10);
      float airmass = 1.0 / max(sin(max(altitude, 0.0)) + 0.15, 0.15);
      float rawOD = uAtmDensity * 11200.0 * airmass;
      float opticalDepth = min(rawOD, viewODCap);

      // Separate dust optical depth (decoupled from gas pressure)
      // Mars dust is visible even at 0.006 atm because particulates
      // have independent column density from the carrier gas
      float dustOD = uDustDensity * 11200.0 * airmass;
      // Ozone adds to extinction (absorbs green preferentially along the path)
      // but doesn't change scattering caps or sky brightness -- only color
      vec3 transmittance = exp(-(extinctionBeta * opticalDepth + uBetaMie * dustOD));
      // Scattering-only transmittance for alpha (ozone shouldn't make dome opaque)
      vec3 scatterTransmittance = exp(-(totalBeta * opticalDepth + uBetaMie * dustOD));

      // Sun transmittance (higher cap to preserve sunset reddening)
      float sunAlt = max(uSunDirection.y, 0.0);
      float sunAirmass = 1.0 / max(sunAlt + 0.035, 0.035);
      float rawSunOD = uAtmDensity * 11200.0 * sunAirmass;
      float sunOD = min(rawSunOD, 5.0 / max(maxBeta, 1e-10));
      float sunDustOD = uDustDensity * 11200.0 * sunAirmass;
      vec3 sunTransmittance = exp(-(extinctionBeta * sunOD + uBetaMie * sunDustOD));

      // scatterWeight uses totalBeta (not extinctionBeta) to preserve sky brightness.
      // The orange-red sunset shift comes from sunTransmittance (ozone absorbs green
      // along the sun-to-scatter-point path) and transmittance (absorbs green along
      // the scatter-point-to-eye path). Dividing by extinctionBeta would dim the
      // entire sky, which our single-scattering model can't compensate for.
      vec3 scatterWeight = (uBetaRayleigh * phaseR + uBetaMie * (phaseM + dustMultiScatter)) / max(totalBeta, vec3(1e-10));
      vec3 inScatter = scatterWeight * sunTransmittance * uSunColor * uSunIntensity * 20.0 * (1.0 - transmittance);

      // Apply exposure: Mie-dominated atmospheres (Mars dust) produce extreme
      // forward-scatter brightness near the sun. Exposure adapts like camera
      // auto-exposure. Applied to both color AND washout alpha so they stay
      // consistent (avoids dark-but-opaque overlays that show color artifacts).
      // Adaptive exposure: only compress extreme forward-scatter peaks (near sun).
      // Away from the sun, the physically-correct sky color is preserved.
      // On Earth (uExposure ~1.0), this is a no-op.
      float pixelLuminance = dot(inScatter, vec3(0.2126, 0.7152, 0.0722));
      float adaptiveExposure = uExposure + (1.0 - uExposure) / (1.0 + pixelLuminance * 2.0);
      vec3 exposedScatter = inScatter * adaptiveExposure;

      // Extinction: how much of the background (stars) is blocked by the atmosphere column.
      // Uses scattering-only transmittance so ozone absorption doesn't block starlight.
      float avgExtinction = 1.0 - (scatterTransmittance.r + scatterTransmittance.g + scatterTransmittance.b) / 3.0;

      // Tone mapping (luminance-preserving Reinhard — prevents hue shift at sunset)
      float toneLum = dot(exposedScatter, vec3(0.2126, 0.7152, 0.0722));
      float mappedLum = toneLum / (toneLum + 1.0);
      vec3 color = exposedScatter * (mappedLum / max(toneLum, 1e-6));
      color = min(color, vec3(1.0));
      color = pow(color, vec3(0.85));

      // Alpha from scattered light brightness.
      // At night (uSunIntensity=0), dome is fully transparent so Milky Way shows.
      // During day, scattered light washes out stars proportionally.
      // Thick atmospheres (Venus) stay opaque via high scatter even at twilight.
      float skyLuminance = dot(exposedScatter, vec3(0.2126, 0.7152, 0.0722));
      float brightnessWashout = 1.0 - exp(-skyLuminance * 12.0);
      float alpha = max(avgExtinction * uSunIntensity, brightnessWashout) * horizonFade;

      gl_FragColor = vec4(color, alpha);
    }
  `},ve={uniforms:{uAtmColor:{value:new D(6724095)},uSunDir:{value:new o(1,0,0)}},vertexShader:`
    varying float vFresnel;
    varying float vSunFactor;
    uniform vec3 uSunDir;

    void main() {
      // All calculations in view space for consistency
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec3 viewNormal = normalize(normalMatrix * normal);
      vec3 viewDir = normalize(-mvPosition.xyz);

      // Fresnel: stronger at edges (limb), with a soft falloff
      float NdotV = abs(dot(viewNormal, viewDir));
      vFresnel = pow(1.0 - NdotV, 1.5);

      // Light-side bias: transform sun direction to view space
      vec3 sunDirView = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
      float NdotL = dot(viewNormal, sunDirView);
      vSunFactor = 0.35 + 0.65 * max(NdotL, 0.0);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,fragmentShader:`
    uniform vec3 uAtmColor;
    uniform float uAtmOpacity;

    varying float vFresnel;
    varying float vSunFactor;

    void main() {
      // Base haze + strong Fresnel rim
      float alpha = (0.12 + 0.88 * vFresnel) * uAtmOpacity * vSunFactor;
      gl_FragColor = vec4(uAtmColor, alpha);
    }
  `},Z=400,Q=2,re={opacity:0,tint:new D(1,1,1)};class ge{constructor(){f(this,"mesh",null);f(this,"material",null);f(this,"params",null);f(this,"renderTarget",null);f(this,"offscreenScene",null);f(this,"offscreenCamera",null);f(this,"offscreenDome",null);f(this,"displayQuad",null);f(this,"displayMaterial",null);f(this,"currentWidth",0);f(this,"currentHeight",0)}create(e){var l,c,h;this.dispose();const a=(l=e.conditions)==null?void 0:l.atmosphereType;if((a==="NONE"||a===void 0)&&!((c=e.metadata)==null?void 0:c.atmosphereComposition))return null;const s=(h=e.metadata)==null?void 0:h.atmosphereComposition;if(this.params=oe(s,a),this.params.atmosphereDensity<=0)return null;const i={uSunDirection:{value:new o(0,1,0)},uSunIntensity:{value:0},uSunColor:{value:new o(1,1,1)},uBetaRayleigh:{value:this.params.betaRayleigh.clone()},uBetaMie:{value:this.params.betaMie.clone()},uBetaOzone:{value:this.params.betaOzone.clone()},uAtmDensity:{value:this.params.atmosphereDensity},uMieG:{value:this.params.mieG},uDustDensity:{value:this.params.dustDensity},uExposure:{value:B(this.params)}};this.material=new A({uniforms:i,vertexShader:F.vertexShader,fragmentShader:F.fragmentShader,side:N,transparent:!0,depthWrite:!1,depthTest:!1,blending:I});const n=new U(Z,16,12);this.offscreenDome=new T(n,this.material),this.offscreenDome.frustumCulled=!1,this.offscreenScene=new P,this.offscreenScene.add(this.offscreenDome),this.offscreenCamera=new O,this.renderTarget=new G(1,1,{minFilter:R,magFilter:R,format:V,type:k}),this.displayMaterial=new A({uniforms:{uTexture:{value:this.renderTarget.texture}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(uTexture, vUv);
        }
      `,transparent:!0,depthWrite:!1,depthTest:!1});const m=new W(2,2);return this.displayQuad=new T(m,this.displayMaterial),this.displayQuad.renderOrder=990,this.displayQuad.frustumCulled=!1,this.mesh=this.displayQuad,this.mesh}setDomeTransform(e,a){this.offscreenDome&&(this.offscreenDome.position.copy(e),this.offscreenDome.quaternion.setFromUnitVectors(new o(0,1,0),a))}update(e,a){if(!this.material)return;this.material.uniforms.uSunDirection.value.copy(e);let s;if(a>=10)s=1;else if(a>=-18){const i=(a+18)/28;s=i*i}else s=0;this.material.uniforms.uSunIntensity.value=s}renderToTarget(e,a){if(!this.offscreenScene||!this.offscreenCamera||!this.renderTarget||!this.offscreenDome)return;const s=e.getSize(new ie),i=Math.floor(s.x/Q),n=Math.floor(s.y/Q);(i!==this.currentWidth||n!==this.currentHeight)&&(this.renderTarget.setSize(i,n),this.currentWidth=i,this.currentHeight=n),a instanceof O&&this.offscreenCamera instanceof O&&(this.offscreenCamera.fov=a.fov,this.offscreenCamera.aspect=a.aspect,this.offscreenCamera.near=a.near,this.offscreenCamera.far=a.far,this.offscreenCamera.updateProjectionMatrix()),this.offscreenCamera.position.copy(a.position),this.offscreenCamera.quaternion.copy(a.quaternion),this.offscreenCamera.matrixWorldNeedsUpdate=!0;const m=e.getRenderTarget(),l=e.getClearAlpha();e.setClearAlpha(0),e.setRenderTarget(this.renderTarget),e.clear(),e.render(this.offscreenScene,this.offscreenCamera),e.setRenderTarget(m),e.setClearAlpha(l)}getAtmosphericExtinction(e,a){if(!this.params||this.params.atmosphereDensity<=0)return re;const s=e*(Math.PI/180),i=Math.sin(Math.max(s,0)),n=11200,m=1/Math.max(i+.035,.035),l=this.params.atmosphereDensity*n*m,c=this.params.dustDensity*n*m,h=this.params.betaRayleigh,u=this.params.betaMie,p=this.params.betaOzone,g=Math.exp(-((h.x+u.x+p.x)*l+u.x*c)),x=Math.exp(-((h.y+u.y+p.y)*l+u.y*c)),S=Math.exp(-((h.z+u.z+p.z)*l+u.z*c)),ee=1-(g+x+S)/3;let b;if(a>=10)b=1;else if(a>=-18){const H=(a+18)/28;b=H*H}else b=0;const C=Math.max(g,x,S,.001),te=b>.01?new D(g/C,x/C,S/C):new D(1,1,1);return{opacity:ee,tint:te}}updateScatteringParams(e){this.params=e,this.material&&(this.material.uniforms.uBetaRayleigh.value.copy(e.betaRayleigh),this.material.uniforms.uBetaMie.value.copy(e.betaMie),this.material.uniforms.uBetaOzone.value.copy(e.betaOzone),this.material.uniforms.uAtmDensity.value=e.atmosphereDensity,this.material.uniforms.uMieG.value=e.mieG,this.material.uniforms.uDustDensity.value=e.dustDensity,this.material.uniforms.uExposure.value=B(e))}createFromParams(e){if(this.dispose(),e.atmosphereDensity<=0)return null;this.params=e;const a={uSunDirection:{value:new o(0,.5,.866)},uSunIntensity:{value:1},uSunColor:{value:new o(1,1,1)},uBetaRayleigh:{value:e.betaRayleigh.clone()},uBetaMie:{value:e.betaMie.clone()},uBetaOzone:{value:e.betaOzone.clone()},uAtmDensity:{value:e.atmosphereDensity},uMieG:{value:e.mieG},uDustDensity:{value:e.dustDensity},uExposure:{value:B(e)}};this.material=new A({uniforms:a,vertexShader:F.vertexShader,fragmentShader:F.fragmentShader,side:N,transparent:!0,depthWrite:!1,depthTest:!1,blending:I});const s=new U(Z,16,12);this.offscreenDome=new T(s,this.material),this.offscreenDome.frustumCulled=!1,this.offscreenScene=new P,this.offscreenScene.add(this.offscreenDome),this.offscreenCamera=new O,this.renderTarget=new G(1,1,{minFilter:R,magFilter:R,format:V,type:k}),this.displayMaterial=new A({uniforms:{uTexture:{value:this.renderTarget.texture}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(uTexture, vUv);
        }
      `,transparent:!0,depthWrite:!1,depthTest:!1});const i=new W(2,2);return this.displayQuad=new T(i,this.displayMaterial),this.displayQuad.renderOrder=990,this.displayQuad.frustumCulled=!1,this.mesh=this.displayQuad,this.mesh}setSunDirectionRaw(e,a){this.material&&(this.material.uniforms.uSunDirection.value.copy(e),this.material.uniforms.uSunIntensity.value=a)}setSunColor(e){this.material&&this.material.uniforms.uSunColor.value.copy(e)}getMesh(){return this.mesh}dispose(){this.offscreenDome&&this.offscreenDome.geometry.dispose(),this.material&&this.material.dispose(),this.renderTarget&&this.renderTarget.dispose(),this.displayQuad&&this.displayQuad.geometry.dispose(),this.displayMaterial&&this.displayMaterial.dispose(),this.mesh=null,this.offscreenDome=null,this.offscreenScene=null,this.offscreenCamera=null,this.material=null,this.renderTarget=null,this.displayQuad=null,this.displayMaterial=null,this.params=null}}const d=1989e27,w=696e6,v=3828e23,xe=5778,j=5670374419e-17,r={mass:{min:.08*d,max:150*d},temperature:{min:2400,max:5e4},radius:{min:.1*w,max:1e3*w},luminosity:{min:1e-4*v,max:1e6*v},metallicity:{min:-2,max:.5}};function le(t){return t<3500?"#FF6B35":t<5e3?"#FFB347":t<6e3?"#FFE4B5":t<7500?"#FFFAF0":t<1e4?"#CAE1FF":t<3e4?"#9BB0FF":"#6B7FFF"}function ue(t){return t>=3e4?"O":t>=1e4?"B":t>=7500?"A":t>=6e3?"F":t>=5200?"G":t>=3700?"K":"M"}function ce(t){const e=t/d;return e<.43?v*Math.pow(e,2.3):e<2?v*Math.pow(e,4):e<55?v*Math.pow(e,3.5):v*32e3*e}function me(t){const e=t/d;return e<1?w*Math.pow(e,.8):w*Math.pow(e,.57)}function _(t,e){const a=4*Math.PI*e*e;return Math.pow(t/(a*j),.25)}function he(t){const n=Math.sqrt(t/(4*Math.PI*1.776*1361)),m=Math.sqrt(t/(4*Math.PI*.3207*1361)),l=Math.sqrt(t/(4*Math.PI*1*1361));return{inner:n,outer:m,optimal:l}}function y(t,e,a){return Math.max(e,Math.min(a,t))}function Me(t){const e=[];let a=t.mass??d;a<r.mass.min&&(e.push(`Mass below stellar limit (${(r.mass.min/d).toFixed(2)} M☉). Clamped.`),a=r.mass.min),a>r.mass.max&&(e.push(`Mass above stable limit (${(r.mass.max/d).toFixed(0)} M☉). Clamped.`),a=r.mass.max),a>100*d&&e.push("Extremely massive star - lifetime < 3 million years.");let s=t.radius??me(a);s=y(s,r.radius.min,r.radius.max);let i,n;t.temperature!==void 0?(n=y(t.temperature,r.temperature.min,r.temperature.max),i=4*Math.PI*s*s*j*Math.pow(n,4),i=y(i,r.luminosity.min,r.luminosity.max)):t.luminosity!==void 0?(i=y(t.luminosity,r.luminosity.min,r.luminosity.max),n=_(i,s),n=y(n,r.temperature.min,r.temperature.max)):(i=ce(a),i=y(i,r.luminosity.min,r.luminosity.max),n=_(i,s),n=y(n,r.temperature.min,r.temperature.max));const m=_(i,s);Math.abs(n-m)/m>.3&&t.temperature!==void 0&&e.push("Temperature inconsistent with luminosity/radius. Star may not be main sequence.");const c=y(t.metallicity??0,r.metallicity.min,r.metallicity.max),h=le(n),u=ue(n),p=he(i);return{mass:a,radius:s,temperature:n,luminosity:i,color:h,spectralClass:u,metallicity:c,habitableZone:p,warnings:e}}function Se(t){const e=t/d;return e<.01?`${(e*1e3).toFixed(1)} M_Jupiter`:`${e.toFixed(2)} M☉`}function De(t){return`${(t/w).toFixed(2)} R☉`}function we(t){const e=t/v;return e<.01||e>1e3?e.toExponential(2)+" L☉":e.toFixed(2)+" L☉"}function be(t){return(t/1496e8).toFixed(2)+" AU"}export{ge as A,ve as O,v as S,d as a,w as b,xe as c,r as d,j as e,ye as f,Me as g,oe as h,be as i,we as j,Se as k,De as l,pe as m,ue as n,le as t};
