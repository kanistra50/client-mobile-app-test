export declare interface AGeolocationPluginInterface {

    start(successCallback, errorCallback);
    stop(successCallback, errorCallback);
    kill(successCallback, errorCallback);
}
export declare class S2CPluginInterface {

    /**
     * Method to retrieve user info including data about user and amount
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     * @returns {JSON}
     */
    getUserInfo(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Initiates verification before start of idNow
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    initiateVerification(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Lists credit cards that were used by user for the top up
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    getCreditCards(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to perform top up through
     * 3DS using card identifier and cvc
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} cardId
     * @param {String} cardCVC
     * @param {String} amount
     * @param {String} currency
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    topUpCreditCard(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        cardId: string,
        cardCVC: string,
        amount: string,
        currency: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to top up card with full credentials of card
     * that is used by the user
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} cardNumber
     * @param {String} cardExpDate
     * @param {String} cardCVC
     * @param {String} cardType
     * @param {String} displayName
     * @param {String} amount
     * @param {String} currency
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    topUpCreditCardFull(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        cardNumber: string,
        cardExpDate: string,
        cardCVC: string,
        cardType: string,
        // displayName: string, // TODO: add to plugin
        amount: string,
        currency: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to top up card with Sofort service
     * @param accessToken
     * @param userId
     * @param loginIdentifier
     * @param amount
     * @param currency
     * @param cancelUrl
     * @param successUrl
     * @param isDebug
     * @param success
     * @param error
     */
    sofortTransfer(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        amount: string,
        currency: string,
        cancelUrl: string,
        successUrl: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to retrieve card pin of the user`s physical card
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} cardId
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    getCardPin(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        cardId: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to list all the cards available for the user
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    cardsListing(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to get information about specific card
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} cardId
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    getCardDetails(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        cardId: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to lock chosen card
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} cardId
     * @param {String} refId
     * @param {String} lockReason
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    lockCard(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        cardId: string,
        refId: string,
        lockReason: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to unlock chosen card
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} cardId
     * @param {String} refId
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    unlockCard(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        cardId: string,
        refId: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to activate physical card
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} cardId
     * @param {String} refId
     * @param {String} last4Digits
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    activateCard(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        cardId: string,
        refId: string,
        last4Digits: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Retrieves bank accounts that were previously used by user
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    getBankAccounts(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    ): string;

    /**
     * Method to send money p2p to another user with mobile number
     * @param {String} accessToken
     * @param {String} userId
     * @param {String} loginIdentifier
     * @param {String} receiverMobileNumber
     * @param {String} amount
     * @param {String} currency
     * @param {String} refId
     * @param {Boolean} isDebug
     * @param {Function} success
     * @param {Function} error
     */
    sendMoneyP2P(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        receiverMobileNumber: string,
        amount: string,
        currency: string,
        refId: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    )

    /**
     * Retrieves transactions list for specific period.
     * @param accessToken
     * @param userId
     * @param loginIdentifier
     * @param fromPeriod
     * @param toPeriod
     * @param isDebug
     * @param success
     * @param error
     */
    getTransactionHistory(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        fromPeriod: string,
        toPeriod: string,
        startRow: number,
        endRow: number,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    );

    /**
     * Retrieves account statement for specific period.
     * @param accessToken
     * @param userId
     * @param loginIdentifier
     * @param fromPeriod
     * @param toPeriod
     * @param isDebug
     * @param success
     * @param error
     */
    getAccountStatementPreview(
        accessToken: string,
        userId: string,
        loginIdentifier: string,
        fromPeriod: string,
        toPeriod: string,
        isDebug: boolean,
        success: (data: string) => void,
        error: (error: any) => void
    );
}

