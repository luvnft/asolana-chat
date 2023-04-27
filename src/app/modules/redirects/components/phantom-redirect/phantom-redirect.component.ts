import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PhantomDeeplinkService } from '@shared/services/phantom/phantom-deeplink.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-phantom-redirect',
  templateUrl: './phantom-redirect.component.html',
  styleUrls: ['./phantom-redirect.component.scss']
})
export class PhantomRedirectComponent implements OnInit {

  /*

    TEST CONNECTION

    publickKey=FHs4jGrYzBubjqZ2fHxH1wHNmY4v6r3oGbsskZEgiW35
    privateKey=4JAWZUYwQJ8WhRe6PrnZmGT7cPPnKQ7Bk5qfyuHcuCPH

    phantom_encryption_public_key=9KWwz3fUWtstbPCEu2MihBMo2dKVhyZC9qaDRYWFMwTZ
    nonce=Fc1c7NLzxBS8MESbNBjRGw1bvnLyKJpUc
    data=2ADoUFbVPP5pfanHcKCFNzgvg4Vw51B48Td6qBxdpNp7wCCPCr77HU7YzU38RQCmPiTb1RWkhnGZkp5dA5V3GqwX6AGKKmSorJcy1phwNDhRhWGqE2aN1JTacsPMYKMXZtGsdaWc1hYdoWAwXUKTsaSvzAQcPLkiz7LkY4yzY258LR6wDWd7c4EbvcvmdVfH2v6aWNE7w467dD9DHN2T5URsMAzTK5tFAErEUv13yVZFG46vZPcpSrF3EUsUgDHVCKhCiLYoYU4MYQJAKEN47HFBY45uQzxcj4pMMvCqE671WnkwHPGPGM7Jo6RfJwf1kmCpB66jWNBc5wmorzyE1S8qqowf4yDt2kDkz1R2QTb4gvqAwuqu36Mak2LbnUa6vqcAKFr1iq5NHsZoLjg2n54keVW4DWb2wxviuFGH7YvFuYb9kniRxR3QQRymaEsk5Ksj2J5Ng

    HeDn...AL3z

  */

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private phantomDeeplink: PhantomDeeplinkService
  ) { }

  ngOnInit(): void {
    const method = this.route.snapshot.paramMap.get('method');

    if (!method) {
      this.router.navigate(['/']);
      return
    }

    this.route.queryParams
      .subscribe((params: Params) => {
        setTimeout(() => {
          this.checkTypeRedirect(method, params);
        }, 0);
      });
  }

  checkTypeRedirect(method: string, params: Params) {
    switch (method) {
      case 'connect' : {
        this.onConnect(params);
      };break;
      case 'disconnect' : {
        this.onDisconnect(params);
      };break;
      case 'signAndSendTransaction' : {
        this.onSignAndSendTransaction(params);
      };break;
      case 'signMessage' : {
        this.onSignMessage(params);
      };break;
      default : {
        throw new Error('Error: the method is not available.');
      }
    }
  }


  onConnect(params: Params): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/connect

    const phantomEncryptionPublicKey = params.phantom_encryption_public_key;
    const nonce = params.nonce;
    const data = params.data;

    if (!phantomEncryptionPublicKey || !nonce || !data)
      throw new Error('Error: missing parameters in method onConnect');

    this.phantomDeeplink.walletConnectRedirect(
      phantomEncryptionPublicKey,
      nonce,
      data,
    );
  }

  onDisconnect(params: Params): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/disconnect
    // It is necessary do nothing. Maybe redirect the user to another page.
  }

  onSignAndSendTransaction(params: Params): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/signandsendtransaction

    const nonce = params.nonce;
    const data = params.data;

    if (!nonce || !data)
      throw new Error('Error: missing parameters in method onSignAndSendTransaction');

    const txId = this.phantomDeeplink.signAndSendTransactionRedirect(
      nonce,
      data,
    );

    this.snackBar.open(`Transaction ID: ${txId}`, 'Close', {
      duration: 7000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['app-alert-success']
    });
  }

  onSignMessage(params: Params): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/signmessage
  }

  onError(): void {

  }

}
