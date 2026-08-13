# ReverseAPK Analysis Report
## romeo-3.42.0.apk
Generated: Thu Aug 13 01:07:53 CEST 2026

## AndroidManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" android:compileSdkVersion="35" android:compileSdkVersionCodename="15" android:installLocation="auto" package="com.planetromeo.android.app" platformBuildVersionCode="35" platformBuildVersionName="15">
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES"/>
    <queries>
        <intent>
            <action android:name="android.media.action.IMAGE_CAPTURE"/>
        </intent>
        <intent>
            <action android:name="android.intent.action.OPEN_DOCUMENT"/>
            <data android:mimeType="*/*"/>
        </intent>
        <intent>
            <action android:name="android.intent.action.GET_CONTENT"/>
            <data android:mimeType="*/*"/>
        </intent>
        <intent>
            <action android:name="android.intent.action.VIEW"/>
            <data android:scheme="http"/>
        </intent>
        <intent>
            <action android:name="android.intent.action.GET_CONTENT"/>
        </intent>
        <intent>
            <action android:name="com.android.vending.billing.InAppBillingService.BIND"/>
        </intent>
        <intent>
            <action android:name="com.google.android.apps.play.billingtestcompanion.BillingOverrideService.BIND"/>
        </intent>
        <intent>
            <action android:name="android.intent.action.VIEW"/>
            <data android:scheme="https"/>
        </intent>
        <package android:name="com.google.android.apps.maps"/>
    </queries>
    <uses-feature android:name="android.hardware.camera" android:required="false"/>
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false"/>
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
    <uses-permission android:maxSdkVersion="32" android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC"/>
    <uses-permission android:name="com.android.vending.BILLING"/>
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-feature android:glEsVersion="0x20000" android:required="true"/>
    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE"/>
    <uses-permission android:name="com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE"/>
    <uses-permission android:name="android.permission.ACCESS_ADSERVICES_ATTRIBUTION"/>
    <uses-permission android:name="android.permission.ACCESS_ADSERVICES_AD_ID"/>
    <permission android:name="com.planetromeo.android.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" android:protectionLevel="signature"/>
    <uses-permission android:name="com.planetromeo.android.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"/>
    <application android:appComponentFactory="androidx.core.app.CoreComponentFactory" android:extractNativeLibs="false" android:fullBackupContent="false" android:icon="@mipmap/ic_launcher" android:label="@string/app_name" android:largeHeap="true" android:layoutDirection="ltr" android:localeConfig="@xml/locale_config" android:name="com.planetromeo.android.app.core.PlanetRomeoApplication" android:supportsRtl="false" android:theme="@style/PlanetRomeoTheme.NoActionBar">
        <activity android:exported="false" android:name="com.planetromeo.android.app.exit_interview.ui.ExitInterviewActivity" android:windowSoftInputMode="adjustPan"/>
        <activity android:exported="true" android:label="@string/app_name" android:launchMode="singleTop" android:name="com.planetromeo.android.app.splash.ui.SplashActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoSplash.Theme">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <data android:host="*" android:mimeType="*/*" android:pathPattern=".*PR_Backup.bak" android:scheme="file"/>
                <data android:host="*" android:mimeType="*/*" android:pathPattern=".*PR_Backup.bak" android:scheme="content"/>
            </intent-filter>
        </activity>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.home.ui.HomeActivity" android:screenOrientation="portrait" android:uiOptions="splitActionBarWhenNarrow" android:windowSoftInputMode="adjustPan"/>
        <activity android:name="com.planetromeo.android.app.profile.ui.ViewProfileActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoTheme.NoActionBar" android:windowSoftInputMode="adjustResize"/>
        <activity android:exported="true" android:name="com.planetromeo.android.app.deep_link.DeepLinkActivity" android:theme="@android:style/Theme.NoDisplay">
            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:host="command" android:scheme="planetromeo"/>
                <data android:host="command" android:scheme="romeo"/>
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:host="search" android:pathPrefix="/hashtag" android:scheme="planetromeo"/>
                <data android:host="search" android:pathPrefix="/hashtag" android:scheme="romeo"/>
            </intent-filter>
            <intent-filter android:label="@string/app_name">
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/payment_show_product_selection" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/payment/v4/" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/show_quickshare_album" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/show_chats" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/show_visitors" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/show_radar" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/show_settings" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/show_edit_profile" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/welcome_screen" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/welcome_tour" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/auth/login" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/login" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/app" android:scheme="https"/>
                <data android:host="www.planetromeo.com" android:pathPrefix="/*/app" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/payment_show_product_selection" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/payment/v4/" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/show_quickshare_album" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/show_chats" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/show_visitors" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/show_radar" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/show_settings" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/show_edit_profile" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/welcome_screen" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/welcome_tour" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/auth/login" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/login" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/app" android:scheme="https"/>
                <data android:host="www.romeo.com" android:pathPrefix="/*/app" android:scheme="https"/>
            </intent-filter>
        </activity>
        <activity android:name="com.planetromeo.android.app.media_viewer.picture_management.sectioned_album.ui.SelectSectionedAlbumActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.authentication.signup.ui.ActivitySignup" android:screenOrientation="portrait" android:windowSoftInputMode="adjustResize"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.authentication.forgot_password.ui.ForgotPasswordActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.authentication.account_list.ui.AccountListActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.core.ui.RomeoWebViewActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.travel.travel_overview.ui.SpartacusWebViewActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.profile.edit.ui.EditProfileActivity" android:parentActivityName="com.planetromeo.android.app.home.ui.HomeActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoTheme.NoActionBar" android:windowSoftInputMode="stateAlwaysHidden"/>
        <activity android:name="com.planetromeo.android.app.footprints.ui.FootprintsActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.billing.ui.BillingActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.contacts.ui.edit_contact.ui.EditContactActivity" android:screenOrientation="portrait" android:windowSoftInputMode="stateAlwaysHidden"/>
        <activity android:name="com.planetromeo.android.app.media_viewer.picture_management.albums.ui.AlbumListActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.media_viewer.picture_management.ui.AlbumSelectionActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.location.ui.UserLocationActivity" android:parentActivityName="com.planetromeo.android.app.home.ui.HomeActivity" android:screenOrientation="portrait" android:windowSoftInputMode="stateAlwaysHidden|adjustNothing"/>
        <activity android:name="com.planetromeo.android.app.media_viewer.picture_management.albums.ui.DisplayAlbumActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.profile.pick_profile.ui.PickProfileActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.location.pick_location.ui.PickLocationActivity" android:screenOrientation="portrait" android:windowSoftInputMode="stateAlwaysHidden|adjustNothing"/>
        <activity android:name="com.planetromeo.android.app.location.ui.ShowLocationActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.billing.ui.payment_history.PaymentHistoryActivity" android:screenOrientation="portrait"/>
        <activity android:configChanges="orientation|screenSize" android:name="com.planetromeo.android.app.billing.ui.payment_order.PaymentOrderActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.profile.change_email.ChangeEmailActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.contacts.ui.friend_requests.FriendRequestsActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.legacy_radar.search_filter_settings.ui.EditRadarSettingsActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoTheme.Transparent"/>
        <activity android:name="com.planetromeo.android.app.debug.testbed.TestBedActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.authentication.login.ui.LoginActivity" android:screenOrientation="portrait" android:windowSoftInputMode="adjustResize"/>
        <activity android:configChanges="keyboardHidden|orientation|screenSize" android:name="com.planetromeo.android.app.profile.interview.ui.StatsInterviewActivity" android:parentActivityName="com.planetromeo.android.app.home.ui.HomeActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoTheme.Transparent">
            <meta-data android:name="android.support.PARENT_ACTIVITY" android:value="com.planetromeo.android.app.home.ui.HomeActivity"/>
        </activity>
        <activity android:exported="false" android:label="@string/support_activity_title" android:name="zendesk.support.guide.HelpCenterActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoZendeskTheme" android:windowSoftInputMode="adjustResize"/>
        <activity android:configChanges="orientation|screenSize" android:exported="false" android:label="@string/zs_view_article_loading_title" android:name="zendesk.support.guide.ViewArticleActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoZendeskTheme"/>
        <activity android:exported="false" android:name="zendesk.support.request.RequestActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoZendeskTheme" android:windowSoftInputMode="adjustResize"/>
        <activity android:exported="false" android:label="@string/request_list_activity_title" android:name="zendesk.support.requestlist.RequestListActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoZendeskTheme"/>
        <activity android:name="com.planetromeo.android.app.location.places.ui.PlacesAutocompleteActivity" android:screenOrientation="portrait" android:theme="@style/PlanetRomeoTheme.Transparent" android:windowSoftInputMode="stateVisible"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.authentication.deactivated.ProfileDeactivatedActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.report_and_block.ui.ReportAndBlockActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.report_and_block.ui.ReportCommentActivity" android:screenOrientation="portrait" android:windowSoftInputMode="adjustResize"/>
        <activity android:name="com.planetromeo.android.app.report_and_block.ui.ReportHateSpeechActivity" android:screenOrientation="portrait" android:windowSoftInputMode="adjustResize"/>
        <activity android:label="Design system Playground" android:name="com.planetromeo.android.app.debug.ui.DsPlaygroundActivity"/>
        <activity android:name="com.planetromeo.android.app.more_menu.about_us.AboutUsActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.more_menu.support.ui.SupportActivity" android:screenOrientation="portrait"/>
        <activity android:name="com.planetromeo.android.app.more_menu.settings.ui.SettingsActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.messages.data_migration.ui.DataMigrationActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.media_viewer.ui.MediaViewerActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.cruise.likes.ui.LikeDetailsActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.radar.ui.detailscreen.RadarPagingActivity" android:screenOrientation="portrait"/>
        <activity android:launchMode="singleTop" android:name="com.planetromeo.android.app.core.ui.ServiceUnavailableActivity" android:screenOrientation="portrait"/>
        <meta-data android:name="firebase_performance_logcat_enabled" android:value="true"/>
        <meta-data android:name="com.google.android.gms.ads.AD_MANAGER_APP" android:value="true"/>
        <meta-data android:name="com.google.android.geo.API_KEY" android:value="@string/google_maps_key"/>
        <meta-data android:name="preloaded_fonts" android:resource="@array/preloaded_fonts"/>
        <meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/ic_notification_logo_white"/>
        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-0030885515157287~7187724580"/>
        <provider android:authorities="com.planetromeo.android.app.fileProvider" android:exported="false" android:grantUriPermissions="true" android:name="androidx.core.content.FileProvider">
            <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/file_paths"/>
        </provider>
        <provider android:authorities="com.planetromeo.android.app.androidx-startup" android:exported="false" android:name="androidx.startup.InitializationProvider">
            <meta-data android:name="androidx.emoji2.text.EmojiCompatInitializer" android:value="androidx.startup"/>
            <meta-data android:name="androidx.lifecycle.ProcessLifecycleInitializer" android:value="androidx.startup"/>
            <meta-data android:name="androidx.profileinstaller.ProfileInstallerInitializer" android:value="androidx.startup"/>
        </provider>
        <service android:exported="false" android:name="com.planetromeo.android.app.core.notification.FcmListenerService">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
            </intent-filter>
        </service>
        <service android:exported="false" android:foregroundServiceType="dataSync" android:name="com.planetromeo.android.app.media_viewer.picture_management.albums.data.UploadPictureService"/>
        <uses-library android:name="com.google.android.maps"/>
        <meta-data android:name="com.google.android.gms.version" android:value="@integer/google_play_services_version"/>
        <receiver android:exported="false" android:name="zendesk.support.DeepLinkingBroadcastReceiver">
            <intent-filter>
                <action android:name="zendesk.support"/>
            </intent-filter>
        </receiver>
        <provider android:authorities="com.planetromeo.android.app.zendesk.support.SupportSdkStartupProvider" android:enabled="true" android:exported="false" android:name="zendesk.support.SupportSdkStartupProvider"/>
        <provider android:authorities="com.planetromeo.android.app.zendesk.support.GuideSdkStartupProvider" android:enabled="true" android:exported="false" android:name="zendesk.support.guide.GuideSdkStartupProvider"/>
        <activity android:exported="false" android:name="zendesk.classic.messaging.MessagingActivity" android:windowSoftInputMode="adjustResize"/>
        <provider android:authorities="com.planetromeo.android.app.zendesk.sdk.user.attachments" android:exported="false" android:grantUriPermissions="true" android:name="zendesk.core.MediaFileProvider">
            <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/zendesk_user_attachments"/>
        </provider>
        <meta-data android:name="com.bumptech.glide.integration.okhttp3.OkHttpGlideModule" android:value="GlideModule"/>
        <provider android:authorities="com.planetromeo.android.app.com.squareup.picasso" android:exported="false" android:name="com.squareup.picasso.PicassoProvider"/>
        <service android:directBootAware="true" android:exported="false" android:name="com.google.firebase.components.ComponentDiscoveryService">
            <meta-data android:name="com.google.firebase.components:com.google.firebase.perf.FirebasePerfKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.perf.FirebasePerfRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.firestore.ktx.FirebaseFirestoreLegacyRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.firestore.FirebaseFirestoreKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.firestore.FirestoreRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.dynamiclinks.FirebaseDynamicLinksKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.dynamiclinks.internal.FirebaseDynamicLinkRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.installations.ktx.FirebaseInstallationsLegacyRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.remoteconfig.FirebaseRemoteConfigKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.remoteconfig.RemoteConfigRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.crashlytics.FirebaseCrashlyticsKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.crashlytics.CrashlyticsRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.sessions.FirebaseSessionsRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.analytics.connector.internal.AnalyticsConnectorRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.installations.FirebaseInstallationsKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.installations.FirebaseInstallationsRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.ktx.FirebaseCommonLegacyRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.FirebaseCommonKtxRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.abt.component.AbtRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
            <meta-data android:name="com.google.firebase.components:com.google.firebase.datatransport.TransportRegistrar" android:value="com.google.firebase.components.ComponentRegistrar"/>
        </service>
        <meta-data android:name="com.google.android.play.billingclient.version" android:value="8.0.0"/>
        <activity android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize" android:exported="false" android:name="com.android.billingclient.api.ProxyBillingActivity" android:theme="@android:style/Theme.Translucent.NoTitleBar"/>
        <activity android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize" android:exported="false" android:name="com.android.billingclient.api.ProxyBillingActivityV2" android:theme="@android:style/Theme.Translucent.NoTitleBar"/>
        <service android:directBootAware="false" android:enabled="@bool/enable_system_alarm_service_default" android:exported="false" android:name="androidx.work.impl.background.systemalarm.SystemAlarmService"/>
        <service android:directBootAware="false" android:enabled="@bool/enable_system_job_service_default" android:exported="true" android:name="androidx.work.impl.background.systemjob.SystemJobService" android:permission="android.permission.BIND_JOB_SERVICE"/>
        <service android:directBootAware="false" android:enabled="@bool/enable_system_foreground_service_default" android:exported="false" android:name="androidx.work.impl.foreground.SystemForegroundService"/>
        <receiver android:directBootAware="false" android:enabled="true" android:exported="false" android:name="androidx.work.impl.utils.ForceStopRunnable$BroadcastReceiver"/>
        <receiver android:directBootAware="false" android:enabled="false" android:exported="false" android:name="androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryChargingProxy">
            <intent-filter>
                <action android:name="android.intent.action.ACTION_POWER_CONNECTED"/>
                <action android:name="android.intent.action.ACTION_POWER_DISCONNECTED"/>
            </intent-filter>
        </receiver>
        <receiver android:directBootAware="false" android:enabled="false" android:exported="false" android:name="androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryNotLowProxy">
            <intent-filter>
                <action android:name="android.intent.action.BATTERY_OKAY"/>
                <action android:name="android.intent.action.BATTERY_LOW"/>
            </intent-filter>
        </receiver>
        <receiver android:directBootAware="false" android:enabled="false" android:exported="false" android:name="androidx.work.impl.background.systemalarm.ConstraintProxy$StorageNotLowProxy">
            <intent-filter>
                <action android:name="android.intent.action.DEVICE_STORAGE_LOW"/>
                <action android:name="android.intent.action.DEVICE_STORAGE_OK"/>
            </intent-filter>
        </receiver>
        <receiver android:directBootAware="false" android:enabled="false" android:exported="false" android:name="androidx.work.impl.background.systemalarm.ConstraintProxy$NetworkStateProxy">
            <intent-filter>
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE"/>
            </intent-filter>
        </receiver>
        <receiver android:directBootAware="false" android:enabled="false" android:exported="false" android:name="androidx.work.impl.background.systemalarm.RescheduleReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED"/>
                <action android:name="android.intent.action.TIME_SET"/>
                <action android:name="android.intent.action.TIMEZONE_CHANGED"/>
            </intent-filter>
        </receiver>
        <receiver android:directBootAware="false" android:enabled="@bool/enable_system_alarm_service_default" android:exported="false" android:name="androidx.work.impl.background.systemalarm.ConstraintProxyUpdateReceiver">
            <intent-filter>
                <action android:name="androidx.work.impl.background.systemalarm.UpdateProxies"/>
            </intent-filter>
        </receiver>
        <receiver android:directBootAware="false" android:enabled="true" android:exported="true" android:name="androidx.work.impl.diagnostics.DiagnosticsReceiver" android:permission="android.permission.DUMP">
            <intent-filter>
                <action android:name="androidx.work.diagnostics.REQUEST_DIAGNOSTICS"/>
            </intent-filter>
        </receiver>
        <service android:directBootAware="true" android:exported="false" android:name="androidx.room.MultiInstanceInvalidationService"/>
        <uses-library android:name="org.apache.http.legacy" android:required="false"/>
        <receiver android:exported="true" android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver" android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
            </intent-filter>
            <meta-data android:name="com.google.android.gms.cloudmessaging.FINISHED_AFTER_HANDLED" android:value="true"/>
        </receiver>
        <service android:directBootAware="true" android:exported="false" android:name="com.google.firebase.messaging.FirebaseMessagingService">
            <intent-filter android:priority="-500">
                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
            </intent-filter>
        </service>
        <receiver android:enabled="true" android:exported="false" android:name="com.google.android.gms.measurement.AppMeasurementReceiver"/>
        <service android:enabled="true" android:exported="false" android:name="com.google.android.gms.measurement.AppMeasurementService"/>
        <service android:enabled="true" android:exported="false" android:name="com.google.android.gms.measurement.AppMeasurementJobService" android:permission="android.permission.BIND_JOB_SERVICE"/>
        <activity android:exported="false" android:name="com.google.android.gms.common.api.GoogleApiActivity" android:theme="@android:style/Theme.Translucent.NoTitleBar"/>
        <service android:enabled="true" android:exported="false" android:name="com.google.firebase.sessions.SessionLifecycleService"/>
        <property android:name="android.adservices.AD_SERVICES_CONFIG" android:resource="@xml/ga_ad_services_config"/>
        <provider android:authorities="com.planetromeo.android.app.firebaseinitprovider" android:directBootAware="true" android:exported="false" android:initOrder="100" android:name="com.google.firebase.provider.FirebaseInitProvider"/>
        <uses-library android:name="androidx.window.extensions" android:required="false"/>
        <uses-library android:name="androidx.window.sidecar" android:required="false"/>
        <activity android:exported="true" android:name="androidx.compose.ui.tooling.PreviewActivity"/>
        <uses-library android:name="android.ext.adservices" android:required="false"/>
        <receiver android:directBootAware="false" android:enabled="true" android:exported="true" android:name="androidx.profileinstaller.ProfileInstallReceiver" android:permission="android.permission.DUMP">
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.INSTALL_PROFILE"/>
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SKIP_FILE"/>
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SAVE_PROFILE"/>
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.BENCHMARK_OPERATION"/>
            </intent-filter>
        </receiver>
        <service android:exported="false" android:name="com.google.android.datatransport.runtime.backends.TransportBackendDiscovery">
            <meta-data android:name="backend:com.google.android.datatransport.cct.CctBackendFactory" android:value="cct"/>
        </service>
        <service android:exported="false" android:name="com.google.android.datatransport.runtime.scheduling.jobscheduling.JobInfoSchedulerService" android:permission="android.permission.BIND_JOB_SERVICE"/>
        <receiver android:exported="false" android:name="com.google.android.datatransport.runtime.scheduling.jobscheduling.AlarmManagerSchedulerBroadcastReceiver"/>
        <activity android:exported="false" android:name="com.google.android.play.core.common.PlayCoreDialogWrapperActivity" android:stateNotNeeded="true" android:theme="@style/Theme.PlayCore.Transparent"/>
    </application>
</manifest>
```

## Package Info
<manifest xmlns:android="http://schemas.android.com/apk/res/android" android:compileSdkVersion="35" android:compileSdkVersionCodename="15" android:installLocation="auto" package="com.planetromeo.android.app" platformBuildVersionCode="35" platformBuildVersionName="15">

## Activities
- com.planetromeo.android.app.exit_interview.ui.ExitInterviewActivity
- com.planetromeo.android.app.splash.ui.SplashActivity
- com.planetromeo.android.app.home.ui.HomeActivity
- com.planetromeo.android.app.profile.ui.ViewProfileActivity
- com.planetromeo.android.app.deep_link.DeepLinkActivity
- com.planetromeo.android.app.media_viewer.picture_management.sectioned_album.ui.SelectSectionedAlbumActivity
- com.planetromeo.android.app.authentication.signup.ui.ActivitySignup
- com.planetromeo.android.app.authentication.forgot_password.ui.ForgotPasswordActivity
- com.planetromeo.android.app.authentication.account_list.ui.AccountListActivity
- com.planetromeo.android.app.core.ui.RomeoWebViewActivity
- com.planetromeo.android.app.travel.travel_overview.ui.SpartacusWebViewActivity
- com.planetromeo.android.app.profile.edit.ui.EditProfileActivity
- com.planetromeo.android.app.footprints.ui.FootprintsActivity
- com.planetromeo.android.app.billing.ui.BillingActivity
- com.planetromeo.android.app.contacts.ui.edit_contact.ui.EditContactActivity
- com.planetromeo.android.app.media_viewer.picture_management.albums.ui.AlbumListActivity
- com.planetromeo.android.app.media_viewer.picture_management.ui.AlbumSelectionActivity
- com.planetromeo.android.app.location.ui.UserLocationActivity
- com.planetromeo.android.app.media_viewer.picture_management.albums.ui.DisplayAlbumActivity
- com.planetromeo.android.app.profile.pick_profile.ui.PickProfileActivity
- com.planetromeo.android.app.location.pick_location.ui.PickLocationActivity
- com.planetromeo.android.app.location.ui.ShowLocationActivity
- com.planetromeo.android.app.billing.ui.payment_history.PaymentHistoryActivity
- com.planetromeo.android.app.billing.ui.payment_order.PaymentOrderActivity
- com.planetromeo.android.app.profile.change_email.ChangeEmailActivity
- com.planetromeo.android.app.contacts.ui.friend_requests.FriendRequestsActivity
- com.planetromeo.android.app.legacy_radar.search_filter_settings.ui.EditRadarSettingsActivity
- com.planetromeo.android.app.debug.testbed.TestBedActivity
- com.planetromeo.android.app.authentication.login.ui.LoginActivity
- com.planetromeo.android.app.profile.interview.ui.StatsInterviewActivity
- zendesk.support.guide.HelpCenterActivity
- zendesk.support.guide.ViewArticleActivity
- zendesk.support.request.RequestActivity
- zendesk.support.requestlist.RequestListActivity
- com.planetromeo.android.app.location.places.ui.PlacesAutocompleteActivity
- com.planetromeo.android.app.authentication.deactivated.ProfileDeactivatedActivity
- com.planetromeo.android.app.report_and_block.ui.ReportAndBlockActivity
- com.planetromeo.android.app.report_and_block.ui.ReportCommentActivity
- com.planetromeo.android.app.report_and_block.ui.ReportHateSpeechActivity
- com.planetromeo.android.app.debug.ui.DsPlaygroundActivity
- com.planetromeo.android.app.more_menu.about_us.AboutUsActivity
- com.planetromeo.android.app.more_menu.support.ui.SupportActivity
- com.planetromeo.android.app.more_menu.settings.ui.SettingsActivity
- com.planetromeo.android.app.messages.data_migration.ui.DataMigrationActivity
- com.planetromeo.android.app.media_viewer.ui.MediaViewerActivity
- com.planetromeo.android.app.cruise.likes.ui.LikeDetailsActivity
- com.planetromeo.android.app.radar.ui.detailscreen.RadarPagingActivity
- com.planetromeo.android.app.core.ui.ServiceUnavailableActivity
- zendesk.classic.messaging.MessagingActivity
- com.android.billingclient.api.ProxyBillingActivity
- com.android.billingclient.api.ProxyBillingActivityV2
- com.google.android.gms.common.api.GoogleApiActivity
- androidx.compose.ui.tooling.PreviewActivity
- com.google.android.play.core.common.PlayCoreDialogWrapperActivity

## Services
- com.planetromeo.android.app.core.notification.FcmListenerService
- com.planetromeo.android.app.media_viewer.picture_management.albums.data.UploadPictureService
- com.google.firebase.components.ComponentDiscoveryService
- androidx.work.impl.background.systemalarm.SystemAlarmService
- androidx.work.impl.background.systemjob.SystemJobService
- androidx.work.impl.foreground.SystemForegroundService
- androidx.room.MultiInstanceInvalidationService
- com.google.firebase.messaging.FirebaseMessagingService
- com.google.android.gms.measurement.AppMeasurementService
- com.google.android.gms.measurement.AppMeasurementJobService
- com.google.firebase.sessions.SessionLifecycleService
- com.google.android.datatransport.runtime.backends.TransportBackendDiscovery
- com.google.android.datatransport.runtime.scheduling.jobscheduling.JobInfoSchedulerService

## Permissions
- android.permission.REQUEST_INSTALL_PACKAGES
- android.permission.INTERNET
- android.permission.ACCESS_FINE_LOCATION
- android.permission.VIBRATE
- android.permission.ACCESS_COARSE_LOCATION
- android.permission.CAMERA
- android.permission.ACCESS_NETWORK_STATE
- android.permission.MODIFY_AUDIO_SETTINGS
- android.permission.FOREGROUND_SERVICE
- android.permission.WAKE_LOCK
- android.permission.READ_MEDIA_IMAGES
- android.permission.READ_EXTERNAL_STORAGE
- android.permission.POST_NOTIFICATIONS
- android.permission.FOREGROUND_SERVICE_DATA_SYNC
- android.permission.RECEIVE_BOOT_COMPLETED
- android.permission.ACCESS_ADSERVICES_ATTRIBUTION
- android.permission.ACCESS_ADSERVICES_AD_ID
        <service android:directBootAware="false" android:enabled="@bool/enable_system_job_service_default" android:exported="true" android:name="androidx.work.impl.background.systemjob.SystemJobService" android:permission="android.permission.BIND_JOB_SERVICE"/>
        <receiver android:directBootAware="false" android:enabled="true" android:exported="true" android:name="androidx.work.impl.diagnostics.DiagnosticsReceiver" android:permission="android.permission.DUMP">
        <receiver android:exported="true" android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver" android:permission="com.google.android.c2dm.permission.SEND">
        <service android:enabled="true" android:exported="false" android:name="com.google.android.gms.measurement.AppMeasurementJobService" android:permission="android.permission.BIND_JOB_SERVICE"/>
        <receiver android:directBootAware="false" android:enabled="true" android:exported="true" android:name="androidx.profileinstaller.ProfileInstallReceiver" android:permission="android.permission.DUMP">
        <service android:exported="false" android:name="com.google.android.datatransport.runtime.scheduling.jobscheduling.JobInfoSchedulerService" android:permission="android.permission.BIND_JOB_SERVICE"/>

## API URLs Found
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:2:<manifest xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:56:<p>http://www.apache.org/licenses/LICENSE-2.0</p>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:66:<p>http://www.apache.org/licenses/LICENSE-2.0</p>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:76:<p>http://www.apache.org/licenses/LICENSE-2.0</p>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:86:<p>http://www.apache.org/licenses/LICENSE-2.0</p>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:94:<p>http://www.apache.org/licenses/LICENSE-2.0</p>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/fallback_picture_format.json:104:      "base_url": "https://pradn.net/img/usr/original/"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/fallback_picture_format.json:4:      "base_url": "https://pradn.net/v12/img/footprints/circular/",
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/fallback_picture_format.json:42:      "base_url": "https://pradn.net/v12/img/footprints/rectangular/",
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/fallback_picture_format.json:62:      "base_url": "https://pradn.net/img/usr/squarish/",
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/fallback_picture_format.json:87:      "base_url": "https://pradn.net/img/usr/portrait/",
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/client_analytics.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/developers/mobile/targeting/proto/client_signals.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/common_types.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/experiment_payload.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/messages.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/perf/v1/perf_metric.proto:120:  // Captured Url: https://wwww.google.com/maps/cities#seattle?id=123
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/perf/v1/perf_metric.proto:121:  // Logged Url: https://wwww.google.com/maps/cities
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/perf/v1/perf_metric.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/apphosting/datastore/testing/datastore_test_trace.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/bundle.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/maybe_document.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/mutation.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:39:  // https://github.com/googleapis/googleapis/blob/master/google/firestore/v1/firestore.proto#L735
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:56:  // https://github.com/googleapis/googleapis/blob/master/google/firestore/v1/firestore.proto#L723
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/admin/index.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/aggregation_result.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/bloom_filter.proto:54:// A bloom filter (https://en.wikipedia.org/wiki/Bloom_filter).
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/bloom_filter.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/common.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/document.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:53:      "https://www.googleapis.com/auth/cloud-platform,"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:54:      "https://www.googleapis.com/auth/datastore";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/query.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/write.proto:7://     http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/internal/rate_limit.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/sdkserving/fiam_fetch_service.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/any.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/api.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/api.proto:52:// this message itself. See https://cloud.google.com/apis/design/glossary for
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/api.proto:73:  // versioning](http://semver.org) where the major version number
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/duration.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/empty.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/field_mask.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/source_context.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/struct.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/timestamp.proto:109:// [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. That is, the
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/timestamp.proto:124:// [toISOString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/timestamp.proto:127:// [`strftime`](https://docs.python.org/2/library/time.html#time.strftime) with
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/timestamp.proto:130:// http://joda-time.sourceforge.net/apidocs/org/joda/time/format/ISODateTimeFormat.html#dateTime()
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/timestamp.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/timestamp.proto:51:// smear](https://developers.google.com/time/smear).
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/timestamp.proto:55:// 3339](https://www.ietf.org/rfc/rfc3339.txt) date strings.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/type.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/protobuf/wrappers.proto:3:// https://developers.google.com/protocol-buffers/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/logs/proto/firebase/inappmessaging/campaign_analytics.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/messaging_event_extension.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/messaging_event.proto:7://      http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/COPYRIGHT:7:http://www.apache.org/licenses/LICENSE-2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/NOTICE.md:21:https://www.apache.org/licenses/LICENSE-2.0.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/NOTICE.md:29:https://github.com/eclipse-ee4j/injection-api
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/NOTICE.md:30:https://github.com/eclipse-ee4j/injection-spec
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/NOTICE.md:31:https://github.com/eclipse-ee4j/injection-tck
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/NOTICE.md:5:* Project home: https://projects.eclipse.org/projects/cdi.batch
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/okhttp3/internal/publicsuffix/NOTICE:2:https://publicsuffix.org/list/public_suffix_list.dat
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/okhttp3/internal/publicsuffix/NOTICE:5:https://mozilla.org/MPL/2.0/
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/abc_grow_fade_in_from_bottom.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:shareInterpolator="false">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/abc_popup_enter.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:shareInterpolator="false">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/abc_popup_exit.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:shareInterpolator="false">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/abc_shrink_fade_out_from_bottom.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:shareInterpolator="false">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/abc_tooltip_enter.xml:2:<alpha xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/abc_tooltip_exit.xml:2:<alpha xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/anim_zoom_in.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/anim_zoom_out.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_checkbox_to_checked_box_inner_merged_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_checkbox_to_checked_box_outer_merged_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_checkbox_to_checked_icon_null_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_checkbox_to_unchecked_box_inner_merged_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_checkbox_to_unchecked_check_path_merged_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_checkbox_to_unchecked_icon_null_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_radio_to_off_mtrl_dot_group_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_radio_to_off_mtrl_ring_outer_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_radio_to_off_mtrl_ring_outer_path_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_radio_to_on_mtrl_dot_group_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_radio_to_on_mtrl_ring_outer_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/btn_radio_to_on_mtrl_ring_outer_path_animation.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/chat_fragment_translate.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:interpolator="@android:anim/linear_interpolator">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/cycle.xml:2:<cycleInterpolator xmlns:android="http://schemas.android.com/apk/res/android" android:cycles="3"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/design_bottom_sheet_slide_in.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/design_bottom_sheet_slide_out.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/design_snackbar_in.xml:2:<translate xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/design_snackbar_out.xml:2:<translate xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/fade_in_delayed.xml:2:<alpha xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/fade_in.xml:2:<alpha xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/fade_out.xml:2:<alpha xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/fragment_fade_in.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:interpolator="@android:anim/linear_interpolator">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/fragment_fast_out_extra_slow_in.xml:2:<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android" android:pathData="M 0,0 C 0.05, 0, 0.133333, 0.06, 0.166666, 0.4 C 0.208333, 0.82, 0.25, 1, 1, 1"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/friends_fragment_translate.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:interpolator="@android:anim/linear_interpolator">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/linear_indeterminate_line1_head_interpolator.xml:2:<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/linear_indeterminate_line1_tail_interpolator.xml:2:<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/linear_indeterminate_line2_head_interpolator.xml:2:<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/linear_indeterminate_line2_tail_interpolator.xml:2:<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_bottom_sheet_slide_in.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_bottom_sheet_slide_out.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_motion_fade_enter.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_motion_fade_exit.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_side_sheet_enter_from_left.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_side_sheet_enter_from_right.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_side_sheet_exit_to_left.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/m3_side_sheet_exit_to_right.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/mtrl_bottom_sheet_slide_in.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/mtrl_bottom_sheet_slide_out.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/mtrl_card_lowers_interpolator.xml:2:<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/no_effect_animation.xml:2:<translate xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/picture_like_to_liked.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/picture_selection_fake.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:ordering="sequentially">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/shake.xml:2:<translate xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/slide_down.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="300">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/slide_in_bottom.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/slide_in_left.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/slide_in_right.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/slide_out_left.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/slide_out_right.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/slide_up.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="300">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_covered.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="@android:integer/config_mediumAnimTime">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_in_previous.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="300">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_in_previous2.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="300">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_in_previous3.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="300">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_in.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="400">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_in2.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="400">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_in3.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="400">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_out.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_out2.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stats_interview_slide_out3.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/stay.xml:2:<translate xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/text_slide_in_bottom.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="@integer/counter_animation_duration">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/text_slide_in_top.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="@integer/counter_animation_duration">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/text_slide_out_bottom.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="@integer/counter_animation_duration">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/anim/text_slide_out_top.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android" android:duration="@integer/counter_animation_duration">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/appbar_always_elevated.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/design_appbar_state_list_animator.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/design_fab_hide_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/design_fab_show_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/fragment_close_enter.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/fragment_close_exit.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/fragment_fade_enter.xml:2:<objectAnimator xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/fragment_fade_exit.xml:2:<objectAnimator xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/fragment_open_enter.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/fragment_open_exit.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_appbar_state_list_animator.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_btn_state_list_anim.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_card_elevated_state_list_anim.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_card_state_list_anim.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_chip_state_list_anim.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_extended_fab_change_size_collapse_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_extended_fab_change_size_expand_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_extended_fab_hide_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_extended_fab_show_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/m3_extended_fab_state_list_animator.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_btn_state_list_anim.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_card_state_list_anim.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_chip_state_list_anim.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_extended_fab_change_size_collapse_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_extended_fab_change_size_expand_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_extended_fab_hide_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_extended_fab_show_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_extended_fab_state_list_animator.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_fab_hide_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_fab_show_motion_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_fab_transformation_sheet_collapse_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/mtrl_fab_transformation_sheet_expand_spec.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/animator/scale_up_down.xml:2:<set xmlns:android="http://schemas.android.com/apk/res/android"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-night/material_timepicker_button_stroke.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-night/material_timepicker_clockface.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-night/material_timepicker_modebutton_tint.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_dark_default_color_primary_text.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_dark_default_color_secondary_text.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_dark_highlighted_text.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_dark_hint_foreground.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_dark_primary_text_disable_only.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_default_color_primary_text.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_default_color_secondary_text.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_highlighted_text.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_hint_foreground.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_dynamic_primary_text_disable_only.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_ref_palette_dynamic_neutral_variant87.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_ref_palette_dynamic_neutral_variant92.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_ref_palette_dynamic_neutral_variant94.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_ref_palette_dynamic_neutral_variant96.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color-v31/m3_ref_palette_dynamic_neutral_variant98.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/abc_background_cache_hint_selector_material_dark.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/abc_background_cache_hint_selector_material_light.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/abc_color_highlight_material.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/abc_hint_foreground_material_dark.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/abc_hint_foreground_material_light.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/abc_primary_text_disable_only_material_dark.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/abc_primary_text_disable_only_material_light.xml:2:<selector xmlns:android="http://schemas.android.com/apk/res/android">

## Potential Secrets / API Keys
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:289:            android:name="com.planetromeo.android.app.authentication.forgot_password.ui.ForgotPasswordActivity"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:456:            android:name="firebase_performance_logcat_enabled"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:462:            android:name="com.google.android.geo.API_KEY"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:463:            android:value="@string/google_maps_key"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:468:            android:name="com.google.firebase.messaging.default_notification_icon"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:500:                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:549:            android:name="com.google.firebase.components.ComponentDiscoveryService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:553:                android:name="com.google.firebase.components:com.google.firebase.perf.FirebasePerfKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:554:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:556:                android:name="com.google.firebase.components:com.google.firebase.perf.FirebasePerfRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:557:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:559:                android:name="com.google.firebase.components:com.google.firebase.firestore.ktx.FirebaseFirestoreLegacyRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:560:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:562:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:563:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:565:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:566:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:568:                android:name="com.google.firebase.components:com.google.firebase.firestore.FirebaseFirestoreKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:569:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:571:                android:name="com.google.firebase.components:com.google.firebase.firestore.FirestoreRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:572:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:574:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:575:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:577:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:578:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:580:                android:name="com.google.firebase.components:com.google.firebase.dynamiclinks.FirebaseDynamicLinksKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:581:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:583:                android:name="com.google.firebase.components:com.google.firebase.dynamiclinks.internal.FirebaseDynamicLinkRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:584:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:586:                android:name="com.google.firebase.components:com.google.firebase.installations.ktx.FirebaseInstallationsLegacyRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:587:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:589:                android:name="com.google.firebase.components:com.google.firebase.remoteconfig.FirebaseRemoteConfigKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:590:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:592:                android:name="com.google.firebase.components:com.google.firebase.remoteconfig.RemoteConfigRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:593:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:595:                android:name="com.google.firebase.components:com.google.firebase.crashlytics.FirebaseCrashlyticsKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:596:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:598:                android:name="com.google.firebase.components:com.google.firebase.crashlytics.CrashlyticsRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:599:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:601:                android:name="com.google.firebase.components:com.google.firebase.sessions.FirebaseSessionsRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:602:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:604:                android:name="com.google.firebase.components:com.google.firebase.analytics.connector.internal.AnalyticsConnectorRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:605:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:607:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:608:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:610:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:611:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:613:                android:name="com.google.firebase.components:com.google.firebase.installations.FirebaseInstallationsKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:614:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:616:                android:name="com.google.firebase.components:com.google.firebase.installations.FirebaseInstallationsRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:617:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:619:                android:name="com.google.firebase.components:com.google.firebase.ktx.FirebaseCommonLegacyRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:620:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:622:                android:name="com.google.firebase.components:com.google.firebase.FirebaseCommonKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:623:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:625:                android:name="com.google.firebase.components:com.google.firebase.abt.component.AbtRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:626:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:628:                android:name="com.google.firebase.components:com.google.firebase.datatransport.TransportRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:629:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:742:            android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:753:            android:name="com.google.firebase.messaging.FirebaseMessagingService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:757:                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:778:            android:name="com.google.firebase.sessions.SessionLifecycleService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:785:            android:name="com.google.firebase.provider.FirebaseInitProvider"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:787:            android:authorities="com.planetromeo.android.app.firebaseinitprovider"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/client_analytics.proto:18:package firebase.transport;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-analytics.properties:2:client=firebase-analytics
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-analytics.properties:3:firebase-analytics_client=22.1.2
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-annotations.properties:2:client=firebase-annotations
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-annotations.properties:3:firebase-annotations_client=16.2.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-auth-interop.properties:2:client=firebase-auth-interop
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-auth-interop.properties:3:firebase-auth-interop_client=20.0.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-database-collection.properties:2:client=firebase-database-collection
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-database-collection.properties:3:firebase-database-collection_client=18.0.1
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-encoders-proto.properties:2:client=firebase-encoders-proto
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-encoders-proto.properties:3:firebase-encoders-proto_client=16.0.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-encoders.properties:2:client=firebase-encoders
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-encoders.properties:3:firebase-encoders_client=17.0.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-iid-interop.properties:2:client=firebase-iid-interop
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-iid-interop.properties:3:firebase-iid-interop_client=17.1.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-measurement-connector.properties:2:client=firebase-measurement-connector
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-measurement-connector.properties:3:firebase-measurement-connector_client=20.0.1
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/common_types.proto:17:package firebase.inappmessaging;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/common_types.proto:19:option java_package = "com.google.firebase.inappmessaging";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/experiment_payload.proto:17:package firebase.inappmessaging;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/experiment_payload.proto:19:option java_package = "com.google.firebase.inappmessaging";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/messages.proto:17:package firebase.inappmessaging;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/messages.proto:19:option java_package = "com.google.firebase.inappmessaging";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/perf/v1/perf_metric.proto:22:package firebase.perf.v1;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/perf/v1/perf_metric.proto:25:option java_outer_classname = "FirebasePerfMetricProto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/perf/v1/perf_metric.proto:26:option java_package = "com.google.firebase.perf.v1";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/maybe_document.proto:20:option java_package = "com.google.firebase.firestore.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/mutation.proto:23:option java_package = "com.google.firebase.firestore.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:20:option java_package = "com.google.firebase.firestore.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/internal/rate_limit.proto:17:package com.google.firebase.inappmessaging.internal;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/internal/rate_limit.proto:19:option java_package = "com.google.firebase.inappmessaging.internal";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:17:package google.internal.firebase.inappmessaging.v1;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:19:option java_package = "com.google.internal.firebase.inappmessaging.v1";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:36:  .firebase.inappmessaging.Priority priority = 3;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:39:  .firebase.inappmessaging.CampaignTime start_time = 4;

## Database References
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:735:            android:name="androidx.room.MultiInstanceInvalidationService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:245:  // `projects/my-project/databases/my-database/documents/chatrooms/my-chatroom`
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:250:  // For example: `chatrooms` or `messages`.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:326:  // `projects/{project_id}/databases/{database_id}/documents/chatrooms/{chatroom_id}`
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:330:  // `chatrooms`.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:518:  // `projects/my-project/databases/my-database/documents/chatrooms/my-chatroom`
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:584:  // `projects/my-project/databases/my-database/documents/chatrooms/my-chatroom`
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:775:    // `projects/my-project/databases/my-database/documents/chatrooms/my-chatroom`
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:912:  // `projects/my-project/databases/my-database/documents/chatrooms/my-chatroom`
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/menu/menu_travel_date_fragment_new.xml:7:        app:showAsAction="ifRoom"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/menu/zs_fragment_help_menu_conversations.xml:9:        app:showAsAction="collapseActionView|ifRoom"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/menu/zs_view_request_conversations_disabled_menu.xml:8:        app:showAsAction="ifRoom"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/attrs.xml:2850:        <flag name="ifRoom" value="1" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:4813:    <public type="id" name="ifRoom" id="0x7f0a026b" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/strings.xml:1704:    <string name="profile_sexual">Bedroom</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/view/menu/i.java:614:            throw new IllegalArgumentException("SHOW_AS_ACTION_ALWAYS, SHOW_AS_ACTION_IF_ROOM, and SHOW_AS_ACTION_NEVER are mutually exclusive.");
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/widget/Y.java:208:            InputStream inputStreamOpenInputStream = this.f6823C.getContentResolver().openInputStream(uri);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/widget/Y.java:544:        return this.f6823C.getContentResolver().query(builderFragment.build(), null, suggestSelection, strArr2, null);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt.java:220:                    ContentResolver contentResolver = context.getContentResolver();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt.java:223:                    rVarK = kotlinx.coroutines.flow.e.K(kotlinx.coroutines.flow.e.x(new WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1(contentResolver, uriFor, new b(aVarB, androidx.core.os.h.a(Looper.getMainLooper())), aVarB, context, null)), kotlinx.coroutines.G.b(), kotlinx.coroutines.flow.p.a.b(kotlinx.coroutines.flow.p.f34529a, 0L, 0L, 3, null), Float.valueOf(Settings.Global.getFloat(context.getContentResolver(), "animator_duration_scale", 1.0f)));
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt.java:3:import android.content.ContentResolver;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:111:            android.content.ContentResolver r9 = r9.getContentResolver()     // Catch: java.lang.Throwable -> L1b
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:123:            android.content.ContentResolver r9 = r8.$resolver
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:129:            android.content.ContentResolver r0 = r8.$resolver
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:15:    final /* synthetic */ ContentResolver $resolver;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:21:    WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1(ContentResolver contentResolver, Uri uri, WindowRecomposer_androidKt.b bVar, kotlinx.coroutines.channels.a<p134o7.s> aVar, Context context, p170s7.c<? super WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1> cVar) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:23:        this.$resolver = contentResolver;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:3:import android.content.ContentResolver;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/ui/platform/WindowRecomposer_androidKt$getAnimationScaleFlowFor$1$1$1.java:87:            android.content.ContentResolver r1 = r8.$resolver
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/CoreComponentFactory.java:31:    public ContentProvider instantiateProvider(ClassLoader classLoader, String str) throws IllegalAccessException, InstantiationException, ClassNotFoundException {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/CoreComponentFactory.java:32:        return (ContentProvider) a(super.instantiateProvider(classLoader, str));
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/CoreComponentFactory.java:8:import android.content.ContentProvider;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:444:        String string = Settings.Secure.getString(context.getContentResolver(), "enabled_notification_listeners");
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:237:        XmlResourceParser fileProviderPathsMetaData = getFileProviderPathsMetaData(context, str, context.getPackageManager().resolveContentProvider(str, 128), i8);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:26:public class FileProvider extends ContentProvider {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:284:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:3:import android.content.ContentProvider;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:303:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:308:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:319:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:324:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:329:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:334:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:339:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/content/FileProvider.java:371:    @Override // android.content.ContentProvider
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/graphics/drawable/IconCompat.java:413:                return context.getContentResolver().openInputStream(uriN);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/graphics/i.java:153:                ParcelFileDescriptor parcelFileDescriptorOpenFileDescriptor = context.getContentResolver().openFileDescriptor(bVarF.d(), "r", cancellationSignal);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/graphics/k.java:3:import android.content.ContentResolver;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/graphics/k.java:63:        ContentResolver contentResolver = context.getContentResolver();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/graphics/k.java:68:                    ParcelFileDescriptor parcelFileDescriptorOpenFileDescriptor = contentResolver.openFileDescriptor(bVar.d(), "r", cancellationSignal);

## HTTP Clients & Libraries
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:542:            android:name="com.bumptech.glide.integration.okhttp3.OkHttpGlideModule"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:51:<h2>Retrofit</h2>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:61:<h2>Okhttp</h2>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values-de/strings.xml:1175:    <string name="prdata_hobby_sports_VOLLEYBALL">Volleyball</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values-es/strings.xml:1175:    <string name="prdata_hobby_sports_VOLLEYBALL">Voleibol</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values-fr/strings.xml:1175:    <string name="prdata_hobby_sports_VOLLEYBALL">Volley–ball</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values-it/strings.xml:1175:    <string name="prdata_hobby_sports_VOLLEYBALL">Pallavolo</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values-pt/strings.xml:1085:    <string name="prdata_hobby_sports_VOLLEYBALL">Voleibol</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:7729:    <public type="string" name="prdata_hobby_sports_VOLLEYBALL" id="0x7f140544" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/strings.xml:1239:    <string name="prdata_hobby_sports_VOLLEYBALL">Volleyball</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/view/g.java:26:import okhttp3.internal.http2.Settings;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/view/menu/g.java:27:import okhttp3.internal.http2.Settings;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/animation/AnimatedContentKt.java:28:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/animation/AnimatedVisibilityKt.java:24:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/animation/CrossfadeKt.java:24:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/contextmenu/ContextMenuArea_androidKt.java:19:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/contextmenu/ContextMenuUi_androidKt.java:43:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/ImageKt.java:19:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/layout/FlowLayoutKt.java:22:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/lazy/grid/LazyGridDslKt.java:16:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/lazy/grid/LazyGridKt.java:32:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/lazy/layout/RunnableC0864a.java:7:import okhttp3.internal.http2.Http2Connection;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/lazy/LazyDslKt.java:12:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/lazy/LazyListKt.java:31:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/pager/LazyLayoutPagerKt.java:28:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/pager/PagerKt.java:15:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/BasicTextFieldKt.java:18:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/BasicTextKt.java:36:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/ClickableTextKt.java:14:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/CoreTextFieldKt.java:68:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/input/internal/C0911x.java:10:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/modifiers/TextAnnotatedStringNode.java:40:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/modifiers/TextStringSimpleNode.java:38:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/foundation/text/selection/AndroidSelectionHandles_androidKt.java:36:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/ButtonKt.java:26:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/DrawerKt.java:38:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/FloatingActionButtonKt.java:27:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/J.java:7:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/ProgressIndicatorKt.java:24:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/pullrefresh/PullRefreshIndicatorKt.java:44:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/ScaffoldKt.java:25:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/SnackbarKt.java:30:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/SurfaceKt.java:27:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/TextKt.java:18:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material/TypographyKt.java:9:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material3/AndroidMenu_androidKt.java:20:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material3/AppBarKt.java:32:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material3/b0.java:5:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material3/BottomSheetDefaults.java:15:import okhttp3.internal.http2.Http2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/compose/material3/BottomSheetScaffoldKt.java:31:import okhttp3.internal.http2.Http2;

## WebSocket / Realtime References
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:468:            android:name="com.google.firebase.messaging.default_notification_icon"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:497:            android:name="com.planetromeo.android.app.core.notification.FcmListenerService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:500:                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:562:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:565:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:574:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:577:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:607:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:610:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:753:            android:name="com.google.firebase.messaging.FirebaseMessagingService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:757:                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/common_types.proto:17:package firebase.inappmessaging;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/common_types.proto:19:option java_package = "com.google.firebase.inappmessaging";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/common_types.proto:22:import "firebase/inappmessaging/proto/messages.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/experiment_payload.proto:17:package firebase.inappmessaging;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/experiment_payload.proto:19:option java_package = "com.google.firebase.inappmessaging";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/messages.proto:17:package firebase.inappmessaging;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/inappmessaging/proto/messages.proto:19:option java_package = "com.google.firebase.inappmessaging";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/internal/rate_limit.proto:17:package com.google.firebase.inappmessaging.internal;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/internal/rate_limit.proto:19:option java_package = "com.google.firebase.inappmessaging.internal";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:17:package google.internal.firebase.inappmessaging.v1;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:19:option java_package = "com.google.internal.firebase.inappmessaging.v1";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:22:import "firebase/inappmessaging/proto/messages.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:23:import "firebase/inappmessaging/proto/common_types.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:24:import "firebase/inappmessaging/proto/experiment_payload.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:36:  .firebase.inappmessaging.Priority priority = 3;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:39:  .firebase.inappmessaging.CampaignTime start_time = 4;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:42:  .firebase.inappmessaging.CampaignTime end_time = 5;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:54:  .firebase.inappmessaging.Content content = 3;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:58:  .firebase.inappmessaging.Priority priority = 4;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:61:  repeated .firebase.inappmessaging.TriggeringCondition triggering_conditions =
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/campaign.proto:98:  .firebase.inappmessaging.ExperimentPayload experiment_payload = 2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/sdkserving/fiam_fetch_service.proto:17:package google.internal.firebase.inappmessaging.v1.sdkserving;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/sdkserving/fiam_fetch_service.proto:19:option java_package = "com.google.internal.firebase.inappmessaging.v1.sdkserving";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/sdkserving/fiam_fetch_service.proto:24:import "google/internal/firebase/inappmessaging/v1/campaign.proto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/logs/proto/firebase/inappmessaging/campaign_analytics.proto:15:// Protos for firebase inappmessaging campaign analytics
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/logs/proto/firebase/inappmessaging/campaign_analytics.proto:19:package logs.proto.firebase.inappmessaging;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/logs/proto/firebase/inappmessaging/campaign_analytics.proto:21:option java_package = "com.google.firebase.inappmessaging";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/logs/proto/firebase/inappmessaging/campaign_analytics.proto:23:option java_outer_classname = "FirebaseInAppMessagingCampaignAnalyticsProto";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/messaging_event_extension.proto:25:// LINT.ThenChange(//depot/google3/logs/proto/firebase/cloud_messaging/client/messaging_event_extension.proto)
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/messaging_event.proto:19:// Describes a Firebase Messaging event on a client.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/messaging_event.proto:89:// LINT.ThenChange(//depot/google3/logs/proto/firebase/cloud_messaging/client/messaging_event.proto)
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/card_landscape_inner.xml:2:<com.google.firebase.inappmessaging.display.internal.layout.CardLayoutLandscape xmlns:android="http://schemas.android.com/apk/res/android" xmlns:fiam="http://schemas.android.com/apk/res-auto"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/card_landscape_inner.xml:37:</com.google.firebase.inappmessaging.display.internal.layout.CardLayoutLandscape>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/card.xml:10:</com.google.firebase.inappmessaging.display.internal.layout.FiamCardView>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/card.xml:2:<com.google.firebase.inappmessaging.display.internal.layout.FiamCardView xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/modal.xml:2:<com.google.firebase.inappmessaging.display.internal.layout.FiamRelativeLayout xmlns:android="http://schemas.android.com/apk/res/android" xmlns:fiam="http://schemas.android.com/apk/res-auto"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/modal.xml:46:    </com.google.firebase.inappmessaging.display.internal.layout.ModalLayoutLandscape>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/modal.xml:53:</com.google.firebase.inappmessaging.display.internal.layout.FiamRelativeLayout>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/layout-land/modal.xml:9:    <com.google.firebase.inappmessaging.display.internal.layout.ModalLayoutLandscape

## Firebase / Google Services
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:456:            android:name="firebase_performance_logcat_enabled"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:459:            android:name="com.google.android.gms.ads.AD_MANAGER_APP"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:468:            android:name="com.google.firebase.messaging.default_notification_icon"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:471:            android:name="com.google.android.gms.ads.APPLICATION_ID"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:500:                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:509:            android:name="com.google.android.gms.version"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:549:            android:name="com.google.firebase.components.ComponentDiscoveryService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:553:                android:name="com.google.firebase.components:com.google.firebase.perf.FirebasePerfKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:554:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:556:                android:name="com.google.firebase.components:com.google.firebase.perf.FirebasePerfRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:557:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:559:                android:name="com.google.firebase.components:com.google.firebase.firestore.ktx.FirebaseFirestoreLegacyRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:560:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:562:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:563:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:565:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.display.FirebaseInAppMessagingDisplayRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:566:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:568:                android:name="com.google.firebase.components:com.google.firebase.firestore.FirebaseFirestoreKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:569:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:571:                android:name="com.google.firebase.components:com.google.firebase.firestore.FirestoreRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:572:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:574:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:575:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:577:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:578:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:580:                android:name="com.google.firebase.components:com.google.firebase.dynamiclinks.FirebaseDynamicLinksKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:581:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:583:                android:name="com.google.firebase.components:com.google.firebase.dynamiclinks.internal.FirebaseDynamicLinkRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:584:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:586:                android:name="com.google.firebase.components:com.google.firebase.installations.ktx.FirebaseInstallationsLegacyRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:587:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:589:                android:name="com.google.firebase.components:com.google.firebase.remoteconfig.FirebaseRemoteConfigKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:590:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:592:                android:name="com.google.firebase.components:com.google.firebase.remoteconfig.RemoteConfigRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:593:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:595:                android:name="com.google.firebase.components:com.google.firebase.crashlytics.FirebaseCrashlyticsKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:596:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:598:                android:name="com.google.firebase.components:com.google.firebase.crashlytics.CrashlyticsRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:599:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:601:                android:name="com.google.firebase.components:com.google.firebase.sessions.FirebaseSessionsRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:602:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:604:                android:name="com.google.firebase.components:com.google.firebase.analytics.connector.internal.AnalyticsConnectorRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:605:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:607:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:608:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:610:                android:name="com.google.firebase.components:com.google.firebase.inappmessaging.FirebaseInAppMessagingRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:611:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:613:                android:name="com.google.firebase.components:com.google.firebase.installations.FirebaseInstallationsKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:614:                android:value="com.google.firebase.components.ComponentRegistrar"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:616:                android:name="com.google.firebase.components:com.google.firebase.installations.FirebaseInstallationsRegistrar"

## OAuth / Authentication
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:209:                    android:pathPrefix="/auth/login"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:213:                    android:pathPrefix="/login"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:265:                    android:pathPrefix="/auth/login"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:269:                    android:pathPrefix="/login"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:284:            android:name="com.planetromeo.android.app.authentication.signup.ui.ActivitySignup"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:289:            android:name="com.planetromeo.android.app.authentication.forgot_password.ui.ForgotPasswordActivity"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:293:            android:name="com.planetromeo.android.app.authentication.account_list.ui.AccountListActivity"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:363:            android:name="com.planetromeo.android.app.authentication.login.ui.LoginActivity"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:409:            android:name="com.planetromeo.android.app.authentication.deactivated.ProfileDeactivatedActivity"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:476:            android:authorities="com.planetromeo.android.app.fileProvider"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:485:            android:authorities="com.planetromeo.android.app.androidx-startup">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:522:            android:authorities="com.planetromeo.android.app.zendesk.support.SupportSdkStartupProvider"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:527:            android:authorities="com.planetromeo.android.app.zendesk.support.GuideSdkStartupProvider"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:535:            android:authorities="com.planetromeo.android.app.zendesk.sdk.user.attachments"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:547:            android:authorities="com.planetromeo.android.app.com.squareup.picasso"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:787:            android:authorities="com.planetromeo.android.app.firebaseinitprovider"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/assets/acknowledgments.html:46:    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/developers/mobile/targeting/proto/client_signals.proto:62:  // The Instance Id Token of the App Instance.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/developers/mobile/targeting/proto/client_signals.proto:64:  string app_instance_token = 2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-auth-interop.properties:2:client=firebase-auth-interop
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase-auth-interop.properties:3:firebase-auth-interop_client=20.0.0
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/firebase/perf/v1/perf_metric.proto:297:  // Identifier for the application that has been registered with firebase.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/mutation.proto:36:  // A stream token that was previously sent by the server.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/mutation.proto:40:  // After sending this token, earlier tokens may not be used anymore so only a
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/mutation.proto:41:  // single stream token is retained.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/mutation.proto:42:  bytes last_stream_token = 2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:103:  // targets resumed with a resume_token) should be suppressed (buffered) until
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:42:  // An opaque, server-assigned token that allows watching a query to be
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:44:  // matches the query. The resume token essentially identifies a point in
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:47:  // This is related to the snapshot_version in that the resume_token
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:48:  // effectively also encodes that value, but the resume_token is opaque and
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:51:  // A consequence of this is that the resume_token should be used when asking
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:55:  // This is the same value as TargetChange.resume_token
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firebase/firestore/proto/target.proto:57:  bytes resume_token = 3;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/common.proto:61:  // Firestore does not allow 3rd party auth requests to create read-write.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:261:  // Optional. A page token, received from a previous `ListDocuments` response.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:265:  // in the request that generated the page token.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:266:  string page_token = 4 [(google.api.field_behavior) = OPTIONAL];
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:315:  // A token to retrieve the next page of documents.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:318:  string next_page_token = 2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:52:  option (google.api.oauth_scopes) =
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:53:      "https://www.googleapis.com/auth/cloud-platform,"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:54:      "https://www.googleapis.com/auth/datastore";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:642:// The first request creates a stream, or resumes an existing one from a token.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:645:// only an ID and a token, to use in the next request.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:648:// given token, then a response containing only an up-to-date token, to use in
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:669:  // A stream token that was previously sent by the server.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:671:  // The client should set this field to the token from the most recent
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:673:  // acknowledges that the client has received responses up to this token. After
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:674:  // sending this token, earlier tokens may not be used anymore.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:683:  bytes stream_token = 4;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:695:  // A token that represents the position of this response in the stream.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:699:  bytes stream_token = 2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:797:  // `resume_token` or `read_time` will be returned. Otherwise, all matching
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:800:    // A resume token from a prior
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:803:    // Using a resume token with a different target is unsupported and may fail.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:804:    bytes resume_token = 4;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:834:  // The number of documents that last matched the query at the resume token or
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:847:    // No change has occurred. Used only to send an updated `resume_token`.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:887:  // A token that can be used to resume the stream for the given `target_ids`,
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:891:  bytes resume_token = 4;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:918:  // A page token. Must be a value from
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:920:  string page_token = 3;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:929:  // A page token that may be used to continue the list.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/firestore.proto:930:  string next_page_token = 2;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/firestore/v1/write.proto:288:  // this field existed; that is, re-add the target without a resume token to
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/sdkserving/fiam_fetch_service.proto:76:  // [required] app instance id token
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/google/internal/firebase/inappmessaging/v1/sdkserving/fiam_fetch_service.proto:77:  string app_instance_id_token = 3;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/logs/proto/firebase/inappmessaging/campaign_analytics.proto:129:  // Identifier for the application that has been registered with firebase.
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/NOTICE.md:13:All content is the property of the respective authors or their employers. For
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/META-INF/NOTICE.md:14:more information regarding authorship of content, please consult the listed
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_dark.xml:11:        android:color="@color/common_google_signin_btn_text_dark_focused"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_dark.xml:12:    <item android:color="@color/common_google_signin_btn_text_dark_default"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_dark.xml:5:        android:color="@color/common_google_signin_btn_text_dark_disabled"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_dark.xml:8:        android:color="@color/common_google_signin_btn_text_dark_pressed"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_light.xml:11:        android:color="@color/common_google_signin_btn_text_light_focused"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_light.xml:12:    <item android:color="@color/common_google_signin_btn_text_light_default"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_light.xml:5:        android:color="@color/common_google_signin_btn_text_light_disabled"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/color/common_google_signin_btn_text_light.xml:8:        android:color="@color/common_google_signin_btn_text_light_pressed"/>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/drawable/common_google_signin_btn_icon_dark_focused.xml:15:    <item android:drawable="@drawable/common_google_signin_btn_icon_dark_normal"/>

## Location / Maps
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/attrs.xml:1728:    <attr name="latLngBoundsNorthEastLatitude" format="float">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/attrs.xml:1730:    <attr name="latLngBoundsNorthEastLongitude" format="float">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/attrs.xml:1732:    <attr name="latLngBoundsSouthWestLatitude" format="float">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/attrs.xml:1734:    <attr name="latLngBoundsSouthWestLongitude" format="float">
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:832:    <public type="attr" name="latLngBoundsNorthEastLatitude" id="0x7f0402c7" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:833:    <public type="attr" name="latLngBoundsNorthEastLongitude" id="0x7f0402c8" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:834:    <public type="attr" name="latLngBoundsSouthWestLatitude" id="0x7f0402c9" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:835:    <public type="attr" name="latLngBoundsSouthWestLongitude" id="0x7f0402ca" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:19:    private final LocationManager f6140b;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:36:    y(Context context, LocationManager locationManager) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:38:        this.f6140b = locationManager;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:44:            f6138d = new y(applicationContext, (LocationManager) applicationContext.getSystemService("location"));
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:5:import android.location.LocationManager;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:78:        xVarB.a(jCurrentTimeMillis - 86400000, location.getLatitude(), location.getLongitude());
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:79:        xVarB.a(jCurrentTimeMillis, location.getLatitude(), location.getLongitude());
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/appcompat/app/y.java:83:        xVarB.a(jCurrentTimeMillis + 86400000, location.getLatitude(), location.getLongitude());
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/exifinterface/media/a.java:731:        d[] dVarArr2 = {new d("ExposureTime", 33434, 5), new d("FNumber", 33437, 5), new d("ExposureProgram", 34850, 3), new d("SpectralSensitivity", 34852, 2), new d("PhotographicSensitivity", 34855, 3), new d("OECF", 34856, 7), new d("SensitivityType", 34864, 3), new d("StandardOutputSensitivity", 34865, 4), new d("RecommendedExposureIndex", 34866, 4), new d("ISOSpeed", 34867, 4), new d("ISOSpeedLatitudeyyy", 34868, 4), new d("ISOSpeedLatitudezzz", 34869, 4), new d("ExifVersion", 36864, 2), new d("DateTimeOriginal", 36867, 2), new d("DateTimeDigitized", 36868, 2), new d("OffsetTime", 36880, 2), new d("OffsetTimeOriginal", 36881, 2), new d("OffsetTimeDigitized", 36882, 2), new d("ComponentsConfiguration", 37121, 7), new d("CompressedBitsPerPixel", 37122, 5), new d("ShutterSpeedValue", 37377, 10), new d("ApertureValue", 37378, 5), new d("BrightnessValue", 37379, 10), new d("ExposureBiasValue", 37380, 10), new d("MaxApertureValue", 37381, 5), new d("SubjectDistance", 37382, 5), new d("MeteringMode", 37383, 3), new d("LightSource", 37384, 3), new d("Flash", 37385, 3), new d("FocalLength", 37386, 5), new d("SubjectArea", 37396, 3), new d("MakerNote", 37500, 7), new d("UserComment", 37510, 7), new d("SubSecTime", 37520, 2), new d("SubSecTimeOriginal", 37521, 2), new d("SubSecTimeDigitized", 37522, 2), new d("FlashpixVersion", 40960, 7), new d("ColorSpace", 40961, 3), new d("PixelXDimension", 40962, 3, 4), new d("PixelYDimension", 40963, 3, 4), new d("RelatedSoundFile", 40964, 2), new d("InteroperabilityIFDPointer", 40965, 4), new d("FlashEnergy", 41483, 5), new d("SpatialFrequencyResponse", 41484, 7), new d("FocalPlaneXResolution", 41486, 5), new d("FocalPlaneYResolution", 41487, 5), new d("FocalPlaneResolutionUnit", 41488, 3), new d("SubjectLocation", 41492, 3), new d("ExposureIndex", 41493, 5), new d("SensingMethod", 41495, 3), new d("FileSource", 41728, 7), new d("SceneType", 41729, 7), new d("CFAPattern", 41730, 7), new d("CustomRendered", 41985, 3), new d("ExposureMode", 41986, 3), new d("WhiteBalance", 41987, 3), new d("DigitalZoomRatio", 41988, 5), new d("FocalLengthIn35mmFilm", 41989, 3), new d("SceneCaptureType", 41990, 3), new d("GainControl", 41991, 3), new d("Contrast", 41992, 3), new d("Saturation", 41993, 3), new d("Sharpness", 41994, 3), new d("DeviceSettingDescription", 41995, 7), new d("SubjectDistanceRange", 41996, 3), new d("ImageUniqueID", 42016, 2), new d("CameraOwnerName", 42032, 2), new d("BodySerialNumber", 42033, 2), new d("LensSpecification", 42034, 5), new d("LensMake", 42035, 2), new d("LensModel", 42036, 2), new d("Gamma", 42240, 5), new d("DNGVersion", 50706, 1), new d("DefaultCropSize", 50720, 3, 4)};
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/exifinterface/media/a.java:733:        d[] dVarArr3 = {new d("GPSVersionID", 0, 1), new d("GPSLatitudeRef", 1, 2), new d("GPSLatitude", 2, 5, 10), new d("GPSLongitudeRef", 3, 2), new d("GPSLongitude", 4, 5, 10), new d("GPSAltitudeRef", 5, 1), new d("GPSAltitude", 6, 5), new d("GPSTimeStamp", 7, 5), new d("GPSSatellites", 8, 2), new d("GPSStatus", 9, 2), new d("GPSMeasureMode", 10, 2), new d("GPSDOP", 11, 5), new d("GPSSpeedRef", 12, 2), new d("GPSSpeed", 13, 5), new d("GPSTrackRef", 14, 2), new d("GPSTrack", 15, 5), new d("GPSImgDirectionRef", 16, 2), new d("GPSImgDirection", 17, 5), new d("GPSMapDatum", 18, 2), new d("GPSDestLatitudeRef", 19, 2), new d("GPSDestLatitude", 20, 5), new d("GPSDestLongitudeRef", 21, 2), new d("GPSDestLongitude", 22, 5), new d("GPSDestBearingRef", 23, 2), new d("GPSDestBearing", 24, 5), new d("GPSDestDistanceRef", 25, 2), new d("GPSDestDistance", 26, 5), new d("GPSProcessingMethod", 27, 7), new d("GPSAreaInformation", 28, 7), new d("GPSDateStamp", 29, 2), new d("GPSDifferential", 30, 3), new d("GPSHPositioningError", 31, 5)};
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/B2/r.java:204:        T(sVar.c().latitude, sVar.c().longitude);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/B2/r.java:213:        T(sVar.c().latitude, sVar.c().longitude);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/B2/r.java:221:        W(latLng.latitude, latLng.longitude, str);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/B2/r.java:244:        if (latLng != null ? this.f376d.c(d9, d10, latLng.latitude, latLng.longitude, 100000L) : false) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/B2/r.java:368:            p044e7.n<UserAddress> nVarC = this.f378f.c(new UserLocation(null, location.latitude, location.longitude, null, null, false, null, null, 217, null));
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:113:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:118:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:123:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:128:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:133:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:138:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:14:import com.google.android.gms.location.FusedLocationProviderApi;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:147:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:152:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:159:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:28:public final class zzbb implements FusedLocationProviderApi {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:54:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:59:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbb.java:86:    @Override // com.google.android.gms.location.FusedLocationProviderApi
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:104:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:121:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:126:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:131:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:136:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:147:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:156:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:167:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:179:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:20:import com.google.android.gms.location.FusedLocationProviderClient;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:205:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:216:    @Override // com.google.android.gms.location.FusedLocationProviderClient
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/internal/location/zzbi.java:221:    @Override // com.google.android.gms.location.FusedLocationProviderClient

## Payments / Billing

## Push Notifications
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:497:            android:name="com.planetromeo.android.app.core.notification.FcmListenerService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:574:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingKtxRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:577:                android:name="com.google.firebase.components:com.google.firebase.messaging.FirebaseMessagingRegistrar"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/AndroidManifest.xml:753:            android:name="com.google.firebase.messaging.FirebaseMessagingService"
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/raw/firebase_common_keep.xml:3:    tools:keep="@string/google_app_id,@string/gcm_defaultSenderId,@string/google_api_key,@string/firebase_database_url,@string/ga_trackingId,@string/google_storage_bucket,@string/project_id" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:7124:    <public type="string" name="fcm_fallback_notification_channel_label" id="0x7f140284" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/public.xml:7149:    <public type="string" name="gcm_defaultSenderId" id="0x7f1402a2" />
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/strings.xml:634:    <string name="fcm_fallback_notification_channel_label">Miscellaneous</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/resources/res/values/strings.xml:659:    <string name="gcm_defaultSenderId">4760212605</string>
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:101:        static List<NotificationChannelGroup> j(NotificationManager notificationManager) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:102:            return notificationManager.getNotificationChannelGroups();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:105:        static List<NotificationChannel> k(NotificationManager notificationManager) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:106:            return notificationManager.getNotificationChannels();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:4:import android.app.NotificationChannel;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:499:    public void d(NotificationChannel notificationChannel) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:5:import android.app.NotificationChannelGroup;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:500:        b.a(this.f16059b, notificationChannel);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:65:        static void a(NotificationManager notificationManager, NotificationChannel notificationChannel) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:66:            notificationManager.createNotificationChannel(notificationChannel);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:69:        static void b(NotificationManager notificationManager, NotificationChannelGroup notificationChannelGroup) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:70:            notificationManager.createNotificationChannelGroup(notificationChannelGroup);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:73:        static void c(NotificationManager notificationManager, List<NotificationChannelGroup> list) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:74:            notificationManager.createNotificationChannelGroups(list);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:77:        static void d(NotificationManager notificationManager, List<NotificationChannel> list) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:78:            notificationManager.createNotificationChannels(list);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:82:            notificationManager.deleteNotificationChannel(str);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:86:            notificationManager.deleteNotificationChannelGroup(str);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:89:        static String g(NotificationChannel notificationChannel) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:90:            return notificationChannel.getId();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:93:        static String h(NotificationChannelGroup notificationChannelGroup) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:94:            return notificationChannelGroup.getId();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:97:        static NotificationChannel i(NotificationManager notificationManager, String str) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/androidx/core/app/s.java:98:            return notificationManager.getNotificationChannel(str);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:135:    public void setDefaultNotificationChannelId(Context context, String str) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:137:            Preconditions.checkNotNull(((NotificationManager) Preconditions.checkNotNull(context.getSystemService("notification"))).getNotificationChannel(str));
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:264:                NotificationChannel notificationChannel = notificationManager.getNotificationChannel("com.google.android.gms.availability");
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:266:                if (notificationChannel == null) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:267:                    notificationManager.createNotificationChannel(new NotificationChannel("com.google.android.gms.availability", string, 4));
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:268:                } else if (!string.contentEquals(notificationChannel.getName())) {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:269:                    notificationChannel.setName(string);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:270:                    notificationManager.createNotificationChannel(notificationChannel);
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/common/GoogleApiAvailability.java:7:import android.app.NotificationChannel;
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/measurement/AppMeasurement.java:35:    public static final String FCM_ORIGIN = "fcm";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/android/gms/stats/CodePackage.java:24:    public static final String GCM = "GCM";
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/api/Usage.java:101:        public Builder clearProducerNotificationChannel() {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/api/Usage.java:103:            ((Usage) this.instance).clearProducerNotificationChannel();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/api/Usage.java:120:        public String getProducerNotificationChannel() {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/api/Usage.java:121:            return ((Usage) this.instance).getProducerNotificationChannel();
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/api/Usage.java:125:        public ByteString getProducerNotificationChannelBytes() {
/Users/cb/ghidra-projects/dating-apps/romeo-3.42.0.apk-reverseapk/jadx/sources/com/google/api/Usage.java:126:            return ((Usage) this.instance).getProducerNotificationChannelBytes();

## Decompiled File Count
- Java files decompiled: 15484

