import { Injectable, Logger } from '@nestjs/common';
import { GovernanceService as GovernanceService } from '../services/governance.service';
import { VoteResponse } from '../api/response/vote.response';
import { PaginatedResponse } from 'src/util/pagination/response/paginated.response';
import { VoteDto } from '../dto/vote.dto';
import { GovernanceMapper } from '../mapper/governance-mapper';
import { UsersService } from 'src/users/services/users.service';
import { PaginateQuery } from 'nestjs-paginate';
import { PaginationDtoMapper } from 'src/util/pagination/mapper/pagination.mapper';
import { UserPhotoDto } from '../dto/user-photo.dto';
import { GovernanceActionProposalResponse } from '../api/response/gov-action-proposal.response';
import { GovernanceActionProposalSearchResponse } from '../api/response/gov-action-proposal-search.response';
import { RationaleResponse } from '../api/response/rationale.response';
import { IpfsService } from 'src/ipfs/services/ipfs.service';
import { RationaleRequest } from '../api/request/rationale.request';
import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { ICIP136 } from '../interfaces/icip136.interface';
import { CIP136 } from '../constants/cip136.constants';

@Injectable()
export class GovernanceFacade {
  private logger = new Logger(GovernanceFacade.name);

  constructor(
    private readonly governanceService: GovernanceService,
    private readonly usersService: UsersService,
    private readonly ipfsService: IpfsService,
  ) {}

  async addRationale(
    userId: string,
    proposalId: string,
    rationaleRequest: RationaleRequest,
  ): Promise<RationaleResponse> {
    const rationaleJson = await this.createRationaleJsonCip100(
      rationaleRequest,
      userId,
    );
    const ipfsContentDto = await this.addRationaleToIpfs(rationaleJson);
    const rationaleDto = GovernanceMapper.ipfsContentDtoToRationaleDto(
      ipfsContentDto,
      userId,
      proposalId,
      rationaleRequest,
    );
    const response = await this.governanceService.addRationale(rationaleDto);
    return GovernanceMapper.rationaleDtoToResponse(response);
  }
  /**
   * Creates a CIP 136 compatible JSON object.
   * CIP 136 example:
   *  https://github.com/Ryun1/CIPs/blob/governance-metadata-cc-rationale/CIP-0136/examples/treasury-withdrawal-unconstitutional.jsonld
   **/
  private async createRationaleJsonCip100(
    rationaleRequest: RationaleRequest,
    userId: string,
  ): Promise<string> {
    const cip136: ICIP136 = {
      '@context': {
        '@language': CIP136.contextLanguage,
        CIP100: CIP136.contextCIP100,
        CIP136: CIP136.contextCIP136,
        hashAlgorithm: CIP136.contextHashAlgorithm,
        body: {
          '@id': CIP136.contextBody,
          '@context': {
            references: {
              '@id': CIP136.contextBodyReferences,
              '@container': '@set',
              '@context': {
                GovernanceMetadata:
                  CIP136.contextBodyReferencesGovernanceMetadata,
                Other: CIP136.contextBodyReferencesOther,
                label: CIP136.contextBodyReferencesLabel,
                uri: CIP136.contextBodyReferencesUri,
                RelevantArticles: CIP136.contextBodyReferencesRelevantArticles,
              },
            },
            summary: CIP136.contextBodySummary,
            rationaleStatement: CIP136.contextBodyRationaleStatement,
            precedentDiscussion: CIP136.contextBodyPrecedentDiscussion,
            counterargumentDiscussion:
              CIP136.contextBodyCounterargumentDiscussion,
            conclusion: CIP136.contextBodyConclusion,
            internalVote: {
              '@id': CIP136.contextBodyInternalVote,
              '@container': '@set',
              '@context': {
                constitutional: CIP136.contextBodyInternalVoteConstitutional,
                unconstitutional:
                  CIP136.contextBodyInternalVoteUnconstitutional,
                abstain: CIP136.contextBodyInternalVoteAbstain,
                didNotVote: CIP136.contextBodyInternalVoteDidNotVote,
              },
            },
          },
        },
        authors: {
          '@id': CIP136.contextAuthors,
          '@container': '@set',
          '@context': {
            did: '@id',
            name: CIP136.contextAuthorsName,
            witness: {
              '@id': CIP136.contextAuthorsWitness,
              '@context': {
                witnessAlgorithm: CIP136.contextWitnessAlgorithm,
                publicKey: CIP136.contextWitnessPublicKey,
                signature: CIP136.contextWitnessSignature,
              },
            },
          },
        },
      },
      hashAlgorithm: CIP136.hashAlgorithm,
      body: {
        summary: rationaleRequest.summary,
        rationaleStatement: rationaleRequest.rationaleStatement,
      },
      authors: [],
    };
    const user = await this.usersService.findById(userId);
    if (user.name) {
      cip136.authors.push({
        name: user.name,
      });
    }
    return JSON.stringify(cip136);
  }

  private async addRationaleToIpfs(
    rationaleJson: string,
  ): Promise<IpfsContentDto> {
    const ipfsContentDto =
      await this.ipfsService.addRationaleToIpfs(rationaleJson);
    return ipfsContentDto;
  }

  async getRationale(
    userId: string,
    proposalId: string,
  ): Promise<RationaleResponse> {
    const response =
      await this.governanceService.findRationaleForUserByProposalId(
        userId,
        proposalId,
      );
    return GovernanceMapper.rationaleDtoToResponse(response);
  }

  async findGovActionProposalById(
    id: string,
  ): Promise<GovernanceActionProposalResponse> {
    const dto = await this.governanceService.findGovProposalById(id);
    return GovernanceMapper.govActionProposalDtoToResponse(dto);
  }

  async searchGovActionProposals(
    query: PaginateQuery,
    userId: string,
  ): Promise<PaginatedResponse<GovernanceActionProposalSearchResponse>> {
    const gapPaginatedDto =
      await this.governanceService.searchGovActionProposals(query);

    gapPaginatedDto.items.forEach((gap) => {
      const userVotesRationaleInfo =
        GovernanceMapper.returnUserVoteRationaleInfo(gap, userId);
      gap.voteStatus = userVotesRationaleInfo.voteStatus;
      gap.hasRationale = userVotesRationaleInfo.hasRationale;
    });

    return new PaginationDtoMapper<
      GovActionProposalDto,
      GovernanceActionProposalSearchResponse
    >().dtoToResponse(
      gapPaginatedDto,
      GovernanceMapper.govActionProposalDtoToSearchResponse,
    );
  }

  async searchGovVotes(
    query: PaginateQuery,
    userId?: string,
  ): Promise<PaginatedResponse<VoteResponse>> {
    const votesPaginatedDto = await this.governanceService.searchGovVotes(
      query,
      userId,
    );

    const userDataMap = await this.getUserDataMap(
      votesPaginatedDto.items.map((voteDto) => {
        return voteDto.userId;
      }),
    );

    votesPaginatedDto.items.forEach((vote) => {
      vote.userName = userDataMap.get(vote.userId)?.userName;
      vote.userPhotoUrl = userDataMap.get(vote.userId)?.photoUrl;
    });

    return new PaginationDtoMapper<VoteDto, VoteResponse>().dtoToResponse(
      votesPaginatedDto,
      GovernanceMapper.voteDtoToResponse,
    );
  }

  private async getUserDataMap(
    ids: string[],
  ): Promise<Map<string, UserPhotoDto>> {
    const userDtos = await this.usersService.findMultipleByIds(ids);
    return new Map(
      userDtos.map((user) => {
        return [user.id, new UserPhotoDto(user.name, user.profilePhotoUrl)];
      }),
    );
  }
}
