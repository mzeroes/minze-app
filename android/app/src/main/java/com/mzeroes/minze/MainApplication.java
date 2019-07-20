package com.mzeroes.minze;

import android.app.Application;
import com.mzeroes.nativemodules.MinzeNativePackage;
import com.mzeroes.nativemodules.RNMinzeNativePackage; // from libs folder
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNTextInputMask.RNTextInputMaskPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.push.AppCenterReactNativePushPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.rnscreens.RNScreensPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactAdapterPackage;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
// import org.unimodules.core.interfaces.Package;
// import org.unimodules.core.interfaces.SingletonModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import expo.modules.constants.ConstantsPackage;
import expo.modules.filesystem.FileSystemPackage;
import expo.modules.imagepicker.ImagePickerPackage;
import expo.modules.location.LocationPackage;
import expo.modules.permissions.PermissionsPackage;
import expo.modules.webbrowser.WebBrowserPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;

public class MainApplication extends Application implements ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(Arrays.asList(
    new ReactAdapterPackage(),
    new ConstantsPackage(),
    new PermissionsPackage(),
    new FileSystemPackage(),
    new WebBrowserPackage(),
    new ImagePickerPackage(),
    new LocationPackage()
  ), Collections.emptyList());

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.asList(
        new MainReactPackage(),
        new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
        new RNCViewPagerPackage(),
        new ReactNativeConfigPackage(),
        new SvgPackage(),
        new RNScreensPackage(),
        new LottiePackage(),
        new SplashScreenReactPackage(),
        new RNGestureHandlerPackage(),
        new RNFirebasePackage(),
        // add/remove these packages as appropriate
        new RNFirebaseAdMobPackage(),
        new RNFirebaseAnalyticsPackage(),
        new RNFirebaseAuthPackage(),
        new RNFirebaseRemoteConfigPackage(),
        new RNFirebaseCrashlyticsPackage(),
        new RNFirebaseDatabasePackage(),
        new RNFirebaseFirestorePackage(),
        new RNFirebaseFunctionsPackage(),
        new RNFirebaseInstanceIdPackage(),
        new RNFirebaseLinksPackage(),
        new RNFirebaseMessagingPackage(),
        new RNFirebaseNotificationsPackage(),
        new RNFirebasePerformancePackage(),
        new RNFirebaseStoragePackage(),
        // App Center
        new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
        new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
        new AppCenterReactNativePushPackage(MainApplication.this),
        new AppCenterReactNativePackage(MainApplication.this),
        // unimodules
        new ModuleRegistryAdapter(mModuleRegistryProvider),
        // new VectorIconsPackage(),
        new LinearGradientPackage(),
        new RNTextInputMaskPackage(),
        new MapsPackage(),
        new MinzeNativePackage(),
        new RNMinzeNativePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this,false);
  }
}
