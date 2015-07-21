interface IIRControlAPIs
{
    GetButtons: string;
    PostButtonPress: string;
    GetCurrentImage: string;
}

interface IIRControlGlobals
{
    API: IIRControlAPIs;
    TemplatePrefix: string;
}

declare var APP_GLOBAL_CONFIG: IIRControlGlobals;    // Defined in the index template